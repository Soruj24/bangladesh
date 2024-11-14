import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000/api', // Base URL for your API
        credentials: 'include', // Include credentials in requests
        withCredentials: true, // Ensure cookies are sent with requests
    }),
    tagTypes: ['auth'],
    endpoints: (build) => ({

        logout: build.mutation({
            query() {
                return {
                    url: `auth/logout`,
                    method: 'POST',
                };
            },
            invalidatesTags: (result, error, id) => [{ type: 'Auth', id }],
        }),

    }),
});

export const {
    useGetUsersQuery,
} = authApi;
