import { BaseQueryApi, createApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import { baseQuery as sharedBaseQuery } from './baseQuery';
import { logout } from '@/features/userSlice';

const baseQueryWithRefresh = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    let result = await sharedBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshResult = await sharedBaseQuery(
            { url: '/auth/refresh-token', method: 'POST' },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const { accessToken } = refreshResult.data as { accessToken: string };
            const currentUser = (api.getState() as { auth: { user: Record<string, unknown> | null } }).auth?.user;
            if (currentUser) {
                api.dispatch({ type: 'auth/setUser', payload: { ...currentUser, accessToken } });
            }
            result = await sharedBaseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};

export const userApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: baseQueryWithRefresh,
    tagTypes: ['Users'],
    endpoints: (build) => ({
        getUsers: build.query({
            query: ({ page = 1, limit = 5, search = "" }) => ({
                url: `users`,
                method: 'GET',
                params: { page, limit, search },
            }),
            providesTags: (result) => {
                if (result?.users) {
                    return [
                        ...result.users.map(({ id }: { id: string }) => ({ type: 'Users' as const, id })),
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
            onQueryStarted: async (_args, { queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem('authToken', data?.user?.accessToken || '');
                } catch {
                    // login failed
                }
            },
        }),
        logoutUser: build.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
            }),
            onQueryStarted: async () => {
                localStorage.removeItem('authToken');
            },
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
