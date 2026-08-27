import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const userApi = createApi({
    reducerPath: 'usersApi',
    baseQuery,
    tagTypes: ['Users'],
    endpoints: (build) => ({
        getUsers: build.query({
            query: ({ page = 1, limit = 5, search = "" }) => ({
                url: `users`,
                method: 'GET',
                params: { page, limit, search },
            }),
            providesTags: (result) => {
                if ((result as unknown as { payload?: { users?: { id: string }[] } })?.payload?.users) {
                    return [
                        ...(result as unknown as { payload: { users: { id: string }[] } }).payload.users.map(({ id }) => ({ type: 'Users' as const, id })),
                        { type: 'Users' as const, id: 'LIST' },
                    ];
                }
                return [{ type: 'Users' as const, id: 'LIST' }];
            },
        }),
        addUser: build.mutation({
            query(body) {
                return { url: `/users/register`, method: 'POST', body };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
        getUser: build.query({
            query: (id: string) => `users/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Users', id }],
        }),
        updateUser: build.mutation({
            query(data: { id: string; [key: string]: unknown }) {
                const { id, ...body } = data;
                return { url: `users/${id}`, method: 'PUT', body };
            },
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Users', id }],
        }),
        deleteUser: build.mutation({
            query(id: string) {
                return { url: `users/${id}`, method: 'DELETE' };
            },
            invalidatesTags: (_result, _error, id) => [{ type: 'Users', id }],
        }),
        loginUser: build.mutation({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
        logoutUser: build.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
            }),
        }),
        roleUpdate: build.mutation({
            query(data: { id: string; role: string }) {
                const { id, ...body } = data;
                return { url: `users/manage-state/${id}`, method: 'PUT', body };
            },
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Users', id }],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useAddUserMutation,
    useGetUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useRoleUpdateMutation,
} = userApi;
