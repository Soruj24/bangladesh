import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Union {
    id: number
    name: string
}

type UnionsResponse = Union[]

export const unionApi = createApi({
    reducerPath: 'unionsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
    tagTypes: ['Unions'],
    endpoints: (build) => ({
        getUnions: build.query<UnionsResponse, { divisionId: number; districtId: number; upazilaId: number }>({
            query: ({ divisionId, districtId, upazilaId }) =>
                `unions/${divisionId}/${districtId}/${upazilaId}`,
            providesTags: (result) =>
                Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Unions', id }) as const),
                        { type: 'Unions', id: 'LIST' },
                    ]
                    : [{ type: 'Unions', id: 'LIST' }],
        }),

        addUnion: build.mutation<Union, { body: Partial<Union>; divisionId: number; districtId: number; upazilaId: number }>({
            query({ body, divisionId, districtId, upazilaId }) {
                return {
                    url: `unions/${divisionId}/${districtId}/${upazilaId}`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Unions', id: 'LIST' }],
        }),
        getUnion: build.query<Union, number>({
            query: (id) => `union/${id}`,
            providesTags: (result, error, id) => [{ type: 'Unions', id }],
        }),
        updateUnion: build.mutation<Union, Partial<Union>>({
            query(data) {
                const { id, ...body } = data;
                return {
                    url: `unions/${id}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Unions', id }],
        }),
        deleteUnion: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `unions/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: (result, error, id) => [{ type: 'Unions', id }],
        }),
    }),
});

export const {
    useGetUnionsQuery,
    useAddUnionMutation,
    useGetUnionQuery,
    useUpdateUnionMutation,
    useDeleteUnionMutation,
} = unionApi;
