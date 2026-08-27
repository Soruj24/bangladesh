import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Union {
    id: string
    name: string
}

type UnionsResponse = Union[]

export const unionApi = createApi({
    reducerPath: 'unionsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api', credentials: 'include' }),
    tagTypes: ['Unions'],
    endpoints: (build) => ({
        getUnions: build.query<UnionsResponse, { divisionId: string; districtId: string; upazilaId: string }>({
            query: ({ divisionId, districtId, upazilaId }) =>
                `unions/${divisionId}/${districtId}/${upazilaId}`,
            providesTags: (result) =>
                Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Unions' as const, id })),
                        { type: 'Unions' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Unions' as const, id: 'LIST' }],
        }),

        addUnion: build.mutation<Union, { body: Partial<Union>; divisionId: string; districtId: string; upazilaId: string }>({
            query({ body, divisionId, districtId, upazilaId }) {
                return {
                    url: `unions/${divisionId}/${districtId}/${upazilaId}`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Unions', id: 'LIST' }],
        }),

        getAllUnions: build.query<UnionsResponse, void>({
            query: () => 'unions',
            providesTags: (result) =>
                Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Unions' as const, id })),
                        { type: 'Unions' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Unions' as const, id: 'LIST' }],
        }),

        getUnion: build.query<Union, string>({
            query: (id) => `union/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Unions', id }],
        }),

        updateUnion: build.mutation<Union, { unionId: string } & Partial<Union>>({
            query(data) {
                const { unionId, ...body } = data;
                return {
                    url: `unions/${unionId}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (_result, _error, { unionId }) => [{ type: 'Unions', id: unionId }],
        }),

        deleteUnion: build.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return { url: `unions/${id}`, method: 'DELETE' };
            },
            invalidatesTags: (_result, _error, id) => [{ type: 'Unions', id }],
        }),
    }),
});

export const {
    useGetUnionsQuery,
    useAddUnionMutation,
    useGetUnionQuery,
    useUpdateUnionMutation,
    useDeleteUnionMutation,
    useGetAllUnionsQuery
} = unionApi;
