import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const divisionApi = createApi({
    reducerPath: 'divisionsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
    tagTypes: ['Divisions'],
    endpoints: (build) => ({
        getDivisions: build.query({
            query: () => 'divisions',
            providesTags: (result) => {
                if (Array.isArray(result)) {
                    return [
                        ...result.map(({ _id }) => ({ type: 'Divisions', id: _id })),
                        { type: 'Divisions', id: 'LIST' },
                    ];
                } else {
                    return [{ type: 'Divisions', id: 'LIST' }];
                }
            },
            refetchOnMountOrArgChange: true,  // Refetch when component mounts or arguments change
            refetchOnFocus: true,             // Refetch on window focus
        }),
        addDivisions: build.mutation({
            query(body) {
                return {
                    url: `divisions`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Divisions', id: 'LIST' }],
        }),
        getDivision: build.query({
            query: (id) => `divisions/${id}`,
            providesTags: (result, error, id) => [{ type: 'Divisions', id }],
        }),
        updateDivision: build.mutation({
            query(data) {
                const { id, ...body } = data;
                return {
                    url: `divisions/${id}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Divisions', id }],
        }),
        deleteDivision: build.mutation({
            query(id) {
                return {
                    url: `divisions/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: (result, error, id) => [{ type: 'Divisions', id }],
        }),
    }),
});

export const {
    useGetDivisionsQuery,
    useAddDivisionsMutation,
    useGetDivisionQuery,
    useUpdateDivisionMutation,
    useDeleteDivisionMutation,
} = divisionApi;
