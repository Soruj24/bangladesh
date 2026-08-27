import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Division {
    id: string;
    name: string;
}

type DivisionsResponse = { divisions: Division[] };

export const divisionApi = createApi({
    reducerPath: 'divisionsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api', credentials: 'include' }),
    tagTypes: ['Divisions'],
    endpoints: (build) => ({
        getDivisions: build.query<DivisionsResponse, void>({
            query: () => 'divisions',
            providesTags: (result) => {
                if (result?.divisions) {
                    return [
                        ...result.divisions.map(({ id }) => ({ type: 'Divisions' as const, id })),
                        { type: 'Divisions' as const, id: 'LIST' },
                    ]
                }
                return [{ type: 'Divisions' as const, id: 'LIST' }]
            },
        }),
        addDivision: build.mutation<Division, Partial<Division>>({
            query(body) {
                return { url: 'divisions', method: 'POST', body }
            },
            invalidatesTags: [{ type: 'Divisions', id: 'LIST' }],
        }),
        getDivision: build.query<Division, number>({
            query: (id) => `division/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Divisions', id }],
        }),
        updateDivision: build.mutation<Division, Partial<Division>>({
            query(data) {
                const { id, ...body } = data
                return { url: `divisions/${id}`, method: 'PUT', body }
            },
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Divisions', id }],
        }),
        deleteDivision: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return { url: `divisions/${id}`, method: 'DELETE' }
            },
            invalidatesTags: (_result, _error, id) => [{ type: 'Divisions', id }],
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
