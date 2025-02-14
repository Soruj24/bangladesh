import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Union {
    id: string
    name: string
}

type UnionsResponse = Union[]

export const unionApi = createApi({
    reducerPath: 'unionsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
    tagTypes: ['Unions'],
    endpoints: (build) => ({
        getUnions: build.query<UnionsResponse, { divisionId: string; districtId: string; upazilaId: string }>({
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
                        ...result.map(({ id }) => ({ type: 'Unions', id }) as const),
                        { type: 'Unions', id: 'LIST' },
                    ]
                    : [{ type: 'Unions', id: 'LIST' }],
        }),

        getUnion: build.query<Union, string>({
            query: (id) => `union/${id}`,
            providesTags: (result, error, id) => [{ type: 'Unions', id }],
        }),

        updateUnion: build.mutation<Union, { unionId: string } & Partial<Union>>({
            query(data) {
                const { unionId, ...body } = data;
               
                return {
                    url: `unions/${unionId}`,
                    method: 'PUT',
                    body,
                    headers: { 'Content-Type': 'application/json' },
                };
            },
            invalidatesTags: (result, error, { unionId}) => [{ type: 'Unions', unionId }],
        }),
        deleteUnion: build.mutation<{ success: boolean; id: string }, string>({
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
    useGetAllUnionsQuery
} = unionApi;
