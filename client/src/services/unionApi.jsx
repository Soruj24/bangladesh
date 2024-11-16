import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const unionApi = createApi({
    reducerPath: 'unionApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }), // Modify base URL as needed
    tagTypes: ['Unions'],
    endpoints: (build) => ({
        getUnions: build.query({
            query: (unionId) => `unions/${unionId}`, // Endpoint to get unions by unionId
            providesTags: (result) =>
                Array.isArray(result) // Check if result is an array
                    ? [
                        ...result.map(({ id }) => ({ type: 'Unions', id })), // Each union gets a tag
                        { type: 'Unions', id: 'LIST' }, // Virtual list id for invalidation
                    ]
                    : result?.data // Handle if result is an object containing data
                        ? [
                            ...result.data.map(({ id }) => ({ type: 'Unions', id })), // Adjust for nested array if data is in result.data
                            { type: 'Unions', id: 'LIST' },
                        ]
                        : [{ type: 'Unions', id: 'LIST' }],
        }),
        handelGetUnions: build.query({
            query: () => `unions`, // Endpoint to get unions by unionId
            providesTags: (result) =>
                Array.isArray(result) // Check if result is an array
                    ? [
                        ...result.map(({ id }) => ({ type: 'Unions', id })), // Each union gets a tag
                        { type: 'Unions', id: 'LIST' }, // Virtual list id for invalidation
                    ]
                    : result?.data // Handle if result is an object containing data
                        ? [
                            ...result.data.map(({ id }) => ({ type: 'Unions', id })), // Adjust for nested array if data is in result.data
                            { type: 'Unions', id: 'LIST' },
                        ]
                        : [{ type: 'Unions', id: 'LIST' }],
        }),
        getUnion: build.query({
            query: (id) => `union/${id}`, // Endpoint to get a single union by ID
            providesTags: (result, error, id) => [{ type: 'Unions', id }],
        }),
        updateUnion: build.mutation({
            query(data) {
                const { id, ...body } = data;
                return {
                    url: `unions/${id}`, // Endpoint to update a union by ID
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Unions', id }],
        }),
        deleteUnion: build.mutation({
            query(id) {
                return {
                    url: `unions/${id}`, // Endpoint to delete a union by ID
                    method: 'DELETE',
                };
            },
            invalidatesTags: (result, error, id) => [{ type: 'Unions', id }],
        }),
        addUnion: build.mutation({
            query: (body) => ({
                url: `unions`, // Endpoint to add a new union
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Unions', id: 'LIST' }], // Invalidate union list after adding
        }),
    }),
});


export const {
    useGetUnionsQuery,
    useHandelGetUnionsQuery,
    useGetUnionQuery,
    useUpdateUnionMutation,
    useDeleteUnionMutation,
    useAddUnionMutation
} = unionApi;
