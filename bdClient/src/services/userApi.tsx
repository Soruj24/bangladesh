import { logOut, setCredentials } from '@/features/userSlice';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with token handling and refresh logic
const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
        const token = getState().user?.token


        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
    },
});


const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403 || result?.error?.status === 401) {
        console.log("Access token expired. Attempting to refresh...");
        const refreshToken = localStorage.getItem("refreshToken");


        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: "auth/refresh-token",
                    method: "POST",
                    body: { refreshToken },
                },
                api,
                extraOptions
            );
            console.log("refreshResult", refreshResult);
            if (refreshResult?.data?.accessToken) {
                const { accessToken } = refreshResult.data as { accessToken: string };
                api.dispatch(
                    setCredentials({
                        accessToken,
                        user: api.getState().auth.user,
                    })
                );
                localStorage.setItem("accessToken", accessToken);
                result = await baseQuery(args, api, extraOptions);
            } else {
                console.error("Failed to refresh token:", refreshResult?.error);
                // api.dispatch(logOut());
            }
        } else {
            console.error("No refresh token available. Logging out...");
            api.dispatch(logOut());
        }
    }

    return result;
};

export interface User {
    id: number;
    name: string;
    email: string;
    accessToken?: string;
}

type UsersResponse = User[];

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Users'],
    endpoints: (build) => ({
        getUsers: build.query<UsersResponse, void>({
            query: () => 'users',

            providesTags: (result) => {
                if (Array.isArray(result)) {
                    return [
                        ...result.map(({ id }) => ({ type: 'Users', id } as const)),
                        { type: 'Users', id: 'LIST' },
                    ];
                } else {

                    return [{ type: 'Users', id: 'LIST' }];
                }
            },
        }),


        addUser: build.mutation<User, Partial<User>>({
            query: (body) => ({
                url: '/users/register',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),

        getUser: build.query<User, number>({
            query: (id) => `user/${id}`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),

        updateUser: build.mutation<User, Partial<User>>({
            query: (data) => {
                const { id, ...body } = data;
                return {
                    url: `user/${id}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
        }),

        deleteUser: build.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `user/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
        }),

        login: build.mutation<{ accessToken: string }, { email: string; password: string }>({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        logout: build.mutation<{ success: boolean }, void>({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useAddUserMutation,
    useGetUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useLoginMutation,
    useLogoutMutation,
} = userApi;
