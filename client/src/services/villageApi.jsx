import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const villageApi = createApi({
    reducerPath: 'villageApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }), // Update baseUrl if needed
    tagTypes: ['Villages'],
    endpoints: (build) => ({
        // Get all villages
        getVillages: build.query({
            query: (villageId) => `villages/${villageId}`, // Update the endpoint to 'villages'
            providesTags: (result) => {
                // Check if result is an array or an object with data property
                if (Array.isArray(result)) {
                    return [
                        ...result.map(({ id }) => ({ type: 'Villages', id })),
                        { type: 'Villages', id: 'LIST' }
                    ];
                } else if (result?.data) {
                    return [
                        ...result.data.map(({ id }) => ({ type: 'Villages', id })),
                        { type: 'Villages', id: 'LIST' }
                    ];
                }
                return [{ type: 'Villages', id: 'LIST' }];
            }
        }),
        handelGetVillages: build.query({
            query: () => `villages`, // Update the endpoint to 'villages'
            providesTags: (result) => {
                // Check if result is an array or an object with data property
                if (Array.isArray(result)) {
                    return [
                        ...result.map(({ id }) => ({ type: 'Villages', id })),
                        { type: 'Villages', id: 'LIST' }
                    ];
                } else if (result?.data) {
                    return [
                        ...result.data.map(({ id }) => ({ type: 'Villages', id })),
                        { type: 'Villages', id: 'LIST' }
                    ];
                }
                return [{ type: 'Villages', id: 'LIST' }];
            }
        }),

        // Add a new village
        addVillage: build.mutation({
            query(body) {
                return {
                    url: 'villages', // Change 'post' to 'village' in the URL
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Villages', id: 'LIST' }],
        }),

        // Get a single village by ID
        getVillage: build.query({
            query: (id) => `village/${id}`, // Update URL to 'village/{id}'
            providesTags: (result, error, id) => [{ type: 'Villages', id }],
        }),

        // Update a village
        updateVillage: build.mutation({
            query(data) {
                const { id, ...body } = data;
                return {
                    url: `villages/${id}`, // Update URL to 'village/{id}'
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Villages', id }],
        }),

        // Delete a village
        deleteVillage: build.mutation({
            query(id) {
                return {
                    url: `villages/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: (result, error, id) => [{ type: 'Villages', id }],
        }),
    }),
});

export const {
    useGetVillagesQuery,
    useHandelGetVillagesQuery,
    useAddVillageMutation,
    useGetVillageQuery,
    useUpdateVillageMutation,
    useDeleteVillageMutation,
} = villageApi;
