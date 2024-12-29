import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Union {
    id: number
    name: string
}

type UnionsResponse = Union[] // Change PostsResponse to UnionsResponse

export const unionApi = createApi({
    reducerPath: 'unionsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }), // Adjust base URL if needed
    tagTypes: ['Unions'],
    endpoints: (build) => ({
        getUnions: build.query<UnionsResponse, void>({
            query: () => 'unions', // Adjust endpoint name to "unions"
            providesTags: (result) =>
                // Ensure result is an array before calling map
                Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Unions', id }) as const),
                        { type: 'Unions', id: 'LIST' },
                    ]
                    : [{ type: 'Unions', id: 'LIST' }],
        }),
        addUnion: build.mutation<Union, Partial<Union>>({
            query(body) {
                return {
                    url: `unions`, // Adjust endpoint name to "union"
                    method: 'POST',
                    body,
                }
            },
            invalidatesTags: [{ type: 'Unions', id: 'LIST' }],
        }),
        getUnion: build.query<Union, number>({
            query: (id) => `union/${id}`, // Adjust endpoint name to "union/{id}"
            providesTags: (result, error, id) => [{ type: 'Unions', id }],
        }),
        updateUnion: build.mutation<Union, Partial<Union>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `unions/${id}`, // Adjust endpoint name to "union/{id}"
                    method: 'PUT',
                    body,
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Unions', id }],
        }),
        deleteUnion: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `unions/${id}`, // Adjust endpoint name to "union/{id}"
                    method: 'DELETE',
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Unions', id }],
        }),
    }),
})

export const {
    useGetUnionsQuery,
    useAddUnionMutation,
    useGetUnionQuery,
    useUpdateUnionMutation,
    useDeleteUnionMutation,
} = unionApi
