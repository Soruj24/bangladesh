import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Population {
    id: number;
    name: string;
    relatedData?: string; // Example of populated data
}

type PopulationResponse = Population[];

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
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Population', id }) as const),
                        { type: 'Population', id: 'LIST' },
                    ]
                    : [{ type: 'Population', id: 'LIST' }],
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
