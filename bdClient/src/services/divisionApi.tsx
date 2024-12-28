import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Division {
    id: number
    name: string
}

type DivisionsResponse = Division[]

export const divisionApi = createApi({
    reducerPath: 'divisionsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
    tagTypes: ['Divisions'],
    endpoints: (build) => ({
        getDivisions: build.query<DivisionsResponse, void>({
            query: () => 'divisions',
            providesTags: (result) =>
                Array.isArray(result) // Ensure result is an array
                    ? [
                        ...result.map(({ id }) => ({ type: 'Divisions', id } as const)),
                        { type: 'Divisions', id: 'LIST' },
                    ]
                    : [{ type: 'Divisions', id: 'LIST' }],
        }),
        addDivision: build.mutation<Division, Partial<Division>>({
            query(body) {
                return {
                    url: 'divisions',
                    method: 'POST',
                    body,
                }
            },
            invalidatesTags: [{ type: 'Divisions', id: 'LIST' }],
        }),
        getDivision: build.query<Division, number>({
            query: (id) => `division/${id}`,
            providesTags: (result, error, id) => [{ type: 'Divisions', id }],
        }),
        updateDivision: build.mutation<Division, Partial<Division>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `division/${id}`,
                    method: 'PUT',
                    body,
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Divisions', id }],
        }),
        deleteDivision: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `division/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Divisions', id }],
        }),
    }),
})

export const {
    useGetDivisionsQuery,
    useAddDivisionMutation,
    useGetDivisionQuery,
    useUpdateDivisionMutation,
    useDeleteDivisionMutation,
} = divisionApi
