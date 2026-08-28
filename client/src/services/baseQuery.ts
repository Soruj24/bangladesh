import { fetchBaseQuery, BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import { logout, setUser } from '@/features/userSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth?.user?.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// Single-flight refresh state
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const baseQuery = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && (result.error as { status: number }).status === 401) {
        const errorCode = (result.error as { data?: { code?: string } }).data?.code;

        // If it's the refresh endpoint itself that failed, don't retry — logout
        const argsUrl = typeof args === 'string' ? args : args.url;
        if (argsUrl === '/auth/refresh-token') {
            api.dispatch(logout());
            return result;
        }

        // If access token is not expired (e.g., invalid token), don't refresh — logout
        if (errorCode && errorCode !== 'ACCESS_TOKEN_EXPIRED') {
            api.dispatch(logout());
            return result;
        }

        if (!isRefreshing) {
            isRefreshing = true;

            try {
                const refreshResult = await rawBaseQuery(
                    { url: '/auth/refresh-token', method: 'POST' },
                    api,
                    extraOptions
                );

                if (refreshResult.data) {
                    const { accessToken } = refreshResult.data as { accessToken: string };
                    const currentUser = (api.getState() as RootState).auth?.user;

                    if (currentUser && accessToken) {
                        api.dispatch(setUser({ ...currentUser, accessToken }));
                    }

                    processQueue(null, accessToken);
                    result = await rawBaseQuery(args, api, extraOptions);
                } else {
                    processQueue(new Error('Refresh failed'), null);
                    api.dispatch(logout());
                }
            } catch (err) {
                processQueue(err, null);
                api.dispatch(logout());
            } finally {
                isRefreshing = false;
            }
        } else {
            // Queue this request while refresh is in progress
            result = await new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => {
                    // After refresh, retry with new token
                    return rawBaseQuery(args, api, extraOptions);
                })
                .catch(() => {
                    return { error: { status: 401, data: { message: 'Refresh failed' } } };
                });
        }
    }

    return result;
};
