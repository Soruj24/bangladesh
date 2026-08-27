import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export interface Population {
    id: number;
    name: string;
}

type PopulationResponse = {
    users: {
        id: string;
        name: string;
        email: string;
        image: string;
        division: string;
        district: string;
        upazila: string;
        union: string;
        village: string;
    }[];
    pagination: {
        totalUsers: number;
        currentPage: number;
        totalPages: number;
        pageSize: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};

export const populationApi = createApi({
    reducerPath: 'populationApi',
    baseQuery,
    tagTypes: ['Population'],
    endpoints: (build) => ({
        getPopulations: build.query<PopulationResponse, { page?: number; limit?: number; search?: string }>({
            query: ({ page = 1, limit = 12, search = "" } = {}) => ({
                url: 'population',
                params: { page, limit, search },
            }),
            providesTags: (result) => {
                if (result?.users) {
                    return [
                        ...result.users.map(({ id }) => ({ type: 'Population' as const, id })),
                        { type: 'Population' as const, id: 'LIST' },
                    ];
                }
                return [{ type: 'Population' as const, id: 'LIST' }];
            }
        }),
        addPopulation: build.mutation<{ message: string; user: Record<string, unknown> }, Record<string, unknown>>({
            query(body) {
                return { url: `population`, method: 'POST', body };
            },
            invalidatesTags: [{ type: 'Population', id: 'LIST' }],
        }),
        getPopulation: build.query<Population, number>({
            query: (id) => ({
                url: `population/${id}`,
                params: { populate: 'relatedData' },
            }),
            providesTags: (_result, _error, id) => [{ type: 'Population', id }],
        }),
        updatePopulation: build.mutation<Population, Partial<Population>>({
            query(data) {
                const { id, ...body } = data;
                return { url: `population/${id}`, method: 'PUT', body };
            },
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Population', id }],
        }),
        deletePopulation: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return { url: `population/${id}`, method: 'DELETE' };
            },
            invalidatesTags: (_result, _error, id) => [{ type: 'Population', id }],
        }),
    }),
});

export const {
    useGetPopulationsQuery,
    useAddPopulationMutation,
    useGetPopulationQuery,
    useUpdatePopulationMutation,
    useDeletePopulationMutation,
} = populationApi;
