import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Village {
    id: number
    name: string
}

type VillagesResponse = Village[]

export const villageApi = createApi({
    reducerPath: 'villagesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }), // Adjust base URL if necessary
    tagTypes: ['Villages'],
    endpoints: (build) => ({
        getVillages: build.query<VillagesResponse, void>({
            query: () => 'villages', // Adjust endpoint to 'villages'
            providesTags: (result) => {
                if (Array.isArray(result)) {
                    return [
                        ...result.map(({ id }) => ({ type: 'Villages', id }) as const),
                        { type: 'Villages', id: 'LIST' },
                    ]
                }
                // If the result is not an array, return just the LIST tag
                return [{ type: 'Villages', id: 'LIST' }]
            },
        }),
        addVillage: build.mutation<Village, Partial<Village>>({
            query(body) {
                return {
                    url: 'villages', // Adjust endpoint to 'village'
                    method: 'POST',
                    body,
                }
            },
            invalidatesTags: [{ type: 'Villages', id: 'LIST' }],
        }),
        getVillage: build.query<Village, number>({
            query: (id) => `village/${id}`, // Adjust endpoint to 'village/{id}'
            providesTags: (result, error, id) => [{ type: 'Villages', id }],
        }),
        updateVillage: build.mutation<Village, Partial<Village>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `villages/${id}`, // Adjust endpoint to 'village/{id}'
                    method: 'PUT',
                    body,
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Villages', id }],
        }),
        deleteVillage: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `villages/${id}`, // Adjust endpoint to 'village/{id}'
                    method: 'DELETE',
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Villages', id }],
        }),
    }),
})

export const {
    useGetVillagesQuery,
    useAddVillageMutation,
    useGetVillageQuery,
    useUpdateVillageMutation,
    useDeleteVillageMutation,
} = villageApi
