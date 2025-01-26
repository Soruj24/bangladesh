import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Population {
    id: number;
    name: string;
    relatedData?: string; // Example of populated data
}

 

type PopulationResponse = {
    users: {
        _id: string;
        name: string;
        email: string;
        image: string;
        division: string;
        district: string;
        upazila: string;
        union: string;
        village: string;
    }[];
};
export const populationApi = createApi({
    reducerPath: 'populationApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/' }),
    tagTypes: ['Population'],
    endpoints: (build) => ({
        getPopulations: build.query<PopulationResponse, void>({
            query: () => ({
                url: 'population',
                params: { populate: 'relatedData' }, // Request population for related fields
            }),
            providesTags: (result) => {
                // Check if result is an array before calling map
                if (Array.isArray(result)) {
                    return [
                        ...result.map(({ id }) => ({ type: 'Population', id }) as const),
                        { type: 'Population', id: 'LIST' },
                    ];
                } else {
                    // If it's not an array, just return the LIST tag
                    return [{ type: 'Population', id: 'LIST' }];
                }
            }
        }),
        addPopulation: build.mutation<Population, Partial<Population>>({
            query(body) {
                return {
                    url: `population`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Population', id: 'LIST' }],
        }),
        getPopulation: build.query<Population, number>({
            query: (id) => ({
                url: `population/${id}`,
                params: { populate: 'relatedData' },
            }),
            providesTags: (result, error, id) => [{ type: 'Population', id }],
        }),
        updatePopulation: build.mutation<Population, Partial<Population>>({
            query(data) {
                const { id, ...body } = data;
                return {
                    url: `population/${id}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Population', id }],
        }),
        deletePopulation: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `population/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: (result, error, id) => [{ type: 'Population', id }],
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
