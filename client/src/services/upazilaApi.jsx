import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const upazilaApi = createApi({
    reducerPath: 'upazilaApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }), // Modify base URL as needed
    tagTypes: ['Upazilas'],
    endpoints: (build) => ({
        getUpazilas: build.query({
            query: (upazilaId) => `upazilas/${upazilaId}`, // Corrected the query string to include '/' between 'upazilas' and 'upazilaId'
            providesTags: (result) =>
                Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Upazilas', id })), // Each upazila gets a tag
                        { type: 'Upazilas', id: 'LIST' }, // Virtual list id for invalidation
                    ]
                    : [{ type: 'Upazilas', id: 'LIST' }],
        }),
        getAllUpazilas: build.query({
            query: () => `upazilas`, // Corrected the query string to include '/' between 'upazilas' and 'upazilaId'
            providesTags: (result) =>
                Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Upazilas', id })), // Each upazila gets a tag
                        { type: 'Upazilas', id: 'LIST' }, // Virtual list id for invalidation
                    ]
                    : [{ type: 'Upazilas', id: 'LIST' }],
        }),
        getUpazila: build.query({
            query: (id) => `upazila/${id}`, // Endpoint to get a single upazila by ID
            providesTags: (result, error, id) => [{ type: 'Upazilas', id }],
        }),
        addUpazila: build.mutation({
            query(body) {
                return {
                    url: `upazilas`, // Endpoint to add a new upazila
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Upazilas', id: 'LIST' }],
        }),
        updateUpazila: build.mutation({
            query(data) {
                const { id, ...body } = data;
                return {
                    url: `upazilas/${id}`, // Endpoint to update an upazila by ID
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Upazilas', id }],
        }),
        deleteUpazila: build.mutation({
            query(id) {
                return {
                    url: `upazilas/${id}`, // Endpoint to delete an upazila by ID
                    method: 'DELETE',
                };
            },
            invalidatesTags: (result, error, id) => [{ type: 'Upazilas', id }],
        }),
    }),
});

export const {
    useGetUpazilasQuery,
    useGetAllUpazilasQuery,
    useGetUpazilaQuery,
    useAddUpazilaMutation,
    useUpdateUpazilaMutation,
    useDeleteUpazilaMutation,
} = upazilaApi;
