import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const districtApi = createApi({
    reducerPath: 'districtsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }), // Modify base URL as needed
    tagTypes: ['Districts'],
    endpoints: (build) => ({
        getDistricts: build.query({
            query: (divisionId) => `districts/${divisionId}`, // Adjusted query to fetch districts by division
            providesTags: (result) =>
                Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Districts', id })), // Each district gets a tag
                        { type: 'Districts', id: 'LIST' }, // Virtual list id for invalidation
                    ]
                    : [{ type: 'Districts', id: 'LIST' }],
        }),
        getDistrict: build.query({
            query: (id) => `district/${id}`, // Endpoint to get a single district by ID
            providesTags: (result, error, id) => [{ type: 'Districts', id }],
        }),
        addDistrict: build.mutation({
            query(body) {
                return {
                    url: `district`, // Endpoint to add a new district
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Districts', id: 'LIST' }],
        }),
        updateDistrict: build.mutation({
            query(data) {
                const { id, ...body } = data;
                return {
                    url: `district/${id}`, // Endpoint to update a district by ID
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Districts', id }],
        }),
        deleteDistrict: build.mutation({
            query(id) {
                return {
                    url: `district/${id}`, // Endpoint to delete a district by ID
                    method: 'DELETE',
                };
            },
            invalidatesTags: (result, error, id) => [{ type: 'Districts', id }],
        }),
    }),
});

export const {
    useGetDistrictsQuery,
    useGetDistrictQuery,
    useAddDistrictMutation,
    useUpdateDistrictMutation,
    useDeleteDistrictMutation,
} = districtApi;
