import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with token refresh logic
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:4000/api', // Replace with your API URL
    credentials: 'include', // Ensures credentials (cookies) are sent with each request
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as any).auth?.accessToken; // Access token from your Redux store
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// Enhanced base query with refresh token logic
const baseQueryWithRefresh = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // If access token expired (401 error), attempt to refresh it
    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery(
            { url: '/auth/refresh-token', method: 'POST' },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            // Store the new access token
            const { accessToken } = refreshResult.data as { accessToken: string };
            api.dispatch({ type: 'auth/tokenUpdated', payload: accessToken }); // Ensure you have an action creator for this

            // Retry the original query with the new token
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Refresh token failed, log out user
            api.dispatch({ type: 'auth/logout' }); // Ensure you have an action creator for this
        }
    }

    return result;
};

export const userApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: baseQueryWithRefresh, // Use the base query with refresh logic
    tagTypes: ['Users'],
    endpoints: (build) => ({
        // Get Users
        getUsers: build.query({
            query: () => 'users',
            providesTags: (result) => {
                if (Array.isArray(result)) {
                    return [
                        ...result.map(({ id }) => ({ type: 'Users', id })),
                        { type: 'Users', id: 'LIST' },
                    ];
                }
                return [{ type: 'Users', id: 'LIST' }];
            },
        }),
        // Add User
        addUser: build.mutation({
            query(body) {
                return {
                    url: `/users/register`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
        // Get Single User
        getUser: build.query({
            query: (id) => `user/${id}`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        // Update User
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
        // Delete User
        deleteUser: build.mutation({
            query(id) {
                return {
                    url: `user/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        // Login User
        loginUser: build.mutation({
            query: (credentials) => ({
                url: 'auth/login', // Adjust to your actual login API endpoint
                method: 'POST',
                body: credentials,
            }),
            // After a successful login, you might want to store user data, JWT, etc. in the state.
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    // Store JWT or user info if needed (e.g., localStorage or redux state)
                    localStorage.setItem('authToken', data.token); // Example, adjust to your response format
                } catch (error) {
                    console.error('Login failed', error);
                }
            },
        }),
        // Logout User
        logoutUser: build.mutation({
            query: () => ({
                url: 'auth/logout', // Adjust to your actual logout API endpoint
                method: 'POST',
            }),
            onQueryStarted: async (args, { dispatch }) => {
                try {
                    // Perform logout operations like clearing JWT, user info, etc.
                    localStorage.removeItem('authToken');
                } catch (error) {
                    console.error('Logout failed', error);
                }
            },
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
} = userApi;
