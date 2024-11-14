import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi', // Ensure this matches with your store config
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000/api', // Base URL for your API
        credentials: 'include', // Include credentials in requests
        withCredentials: true, // Ensure cookies are sent with requests
    }),
    tagTypes: ['Users'], // Make sure this matches your usage of tags
    endpoints: (build) => ({
        getUsers: build.query({
            // Accept search, page, and limit as arguments
            query: ({ search = '', page = 1, limit = 10 }) => ({
                url: 'users',
                params: { search, page, limit },
            }),
            providesTags: (result) => {
                if (result?.users) {
                    return [
                        ...result.users.map(({ id }) => ({ type: 'Users', id })),
                        { type: 'Users', id: 'LIST' },
                    ];
                }
                return [{ type: 'Users', id: 'LIST' }];
            },
        }),
        addUser: build.mutation({
            query(body) {
                return {
                    url: 'users/register',
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
        getUser: build.query({
            query: (id) => `user/${id}`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        updateUser: build.mutation({
            query(data) {
                const { id, ...body } = data;
                return {
                    url: `user/${id}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
        }),
        deleteUser: build.mutation({
            query(id) {
                return {
                    url: `user/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        login: build.mutation({
            query(credentials) {
                return {
                    url: 'auth/login',  // Replace with your actual login endpoint
                    method: 'POST',
                    body: credentials,
                };
            },
        }),
        logout: build.mutation({
            query() {
                return {
                    url: `auth/logout`,
                    method: 'POST',
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
        // Corrected mutation name and URL
        handleSuperAdmin: build.mutation({
            query: ({ userId, role }) => ({
                url: `/users/manage-state/${userId}`,
                method: 'PUT',
                body: { role }
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useHandleSuperAdminMutation, // Renamed to match mutation
    useAddUserMutation,
    useGetUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useLoginMutation,
    useLogoutMutation,
} = userApi;
