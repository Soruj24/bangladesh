// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Upozila {
    id: number
    name: string
}

type UpazilasResponse = Upozila[]

export const upozilaApi = createApi({
    reducerPath: 'upozilasApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/' }),
    tagTypes: ['Upazilas'],
    endpoints: (build) => ({
        getUpazilas: build.query<UpazilasResponse, void>({
            query: () => 'upazilas',
            providesTags: (result) =>
                Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Upazilas', id }) as const),
                        { type: 'Upazilas', id: 'LIST' },
                    ]
                    : [{ type: 'Upazilas', id: 'LIST' }],
        }),
        addUpozila: build.mutation<Upozila, Partial<Upozila>>({
            query(body) {
                return {
                    url: `upazilas`,
                    method: 'POST',
                    body,
                }
            },
            invalidatesTags: [{ type: 'Upazilas', id: 'LIST' }],
        }),
        getUpozila: build.query<Upozila, number>({
            query: (id) => `upozila/${id}`,
            providesTags: (result, error, id) => [{ type: 'Upazilas', id }],
        }),
        updateUpozila: build.mutation<Upozila, Partial<Upozila>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `upazilas/${id}`,
                    method: 'PUT',
                    body,
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Upazilas', id }],
        }),
        deleteUpozila: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `upazilas/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Upazilas', id }],
        }),
    }),
})

export const {
    useGetUpazilasQuery,
    useAddUpozilaMutation,
    useGetUpozilaQuery,
    useUpdateUpozilaMutation,
    useDeleteUpozilaMutation,
} = upozilaApi
