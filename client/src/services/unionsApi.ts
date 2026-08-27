import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'

export interface Union {
    id: string
    name: string
    _id: string
}

export const unionApi = createApi({
    reducerPath: 'unionsApi',
    baseQuery,
    tagTypes: ['Unions'],
    endpoints: (build) => ({
        getUnions: build.query<{ unions: Union[] }, { divisionId: string; districtId: string; upazilaId: string }>({
            query: ({ divisionId, districtId, upazilaId }) =>
                `unions/${divisionId}/${districtId}/${upazilaId}`,
            providesTags: [{ type: 'Unions', id: 'LIST' }],
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

        getAllUnions: build.query<{ union: Union[] }, void>({
            query: () => 'unions',
            providesTags: [{ type: 'Unions', id: 'LIST' }],
        }),

        getUnion: build.query<Union, string>({
            query: (id) => `union/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Unions', id }],
        }),

        updateUnion: build.mutation<Union, { unionId: string; name: string }>({
            query({ unionId, ...body }) {
                return {
                    url: `unions/${unionId}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Unions', id: 'LIST' }],
        }),

        deleteUnion: build.mutation<{ success: boolean }, string>({
            query(id) {
                return { url: `unions/${id}`, method: 'DELETE' };
            },
            invalidatesTags: [{ type: 'Unions', id: 'LIST' }],
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
