import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'

export interface Division {
    id: string;
    name: string;
    _id: string;
    value: string;
    label: string;
}

type DivisionsResponse = { divisions: Division[] };

export const divisionApi = createApi({
    reducerPath: 'divisionsApi',
    baseQuery,
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
        getDivision: build.query<Division, string>({
            query: (id) => `division/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Divisions', id }],
        }),
        updateDivision: build.mutation<Division, { id: string; name: string }>({
            query(data) {
                const { id, ...body } = data
                return { url: `divisions/${id}`, method: 'PUT', body }
            },
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Divisions', id }],
        }),
        deleteDivision: build.mutation<{ success: boolean }, string>({
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
