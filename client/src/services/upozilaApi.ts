import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Upozila {
    id: string;
    name: string;
}

type UpazilasResponse = Upozila[];

export const upozilaApi = createApi({
    reducerPath: 'upozilasApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/' }),
    tagTypes: ['Upazilas'],
    endpoints: (build) => ({
        getUpazilas: build.query<UpazilasResponse, { divisionId: string; districtId: string }>({
            query: ({ divisionId, districtId }) => `upazilas/${divisionId}/${districtId}`,
            providesTags: (result) =>
                Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Upazilas', id }) as const),
                        { type: 'Upazilas', id: 'LIST' },
                    ]
                    : [{ type: 'Upazilas', id: 'LIST' }],
        }),

        getAllUpazilas: build.query<UpazilasResponse, void>({
            query: () => 'upazilas',
            providesTags: (result) =>
                Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Upazilas', id }) as const),
                        { type: 'Upazilas', id: 'LIST' },
                    ]
                    : [{ type: 'Upazilas', id: 'LIST' }],
        }),

        addUpozila: build.mutation<Upozila, { body: Partial<Upozila>; divisionId: string; districtId: string }>({
            query({ body, divisionId, districtId }) {
                return {
                    url: `upazilas/${divisionId}/${districtId}`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Upazilas', id: 'LIST' }],
        }),

        getUpozila: build.query<Upozila, string>({
            query: (id) => `upazila/${id}`,
            providesTags: (result, error, id) => [{ type: 'Upazilas', id }],
        }),

        updateUpozila: build.mutation<Upozila, { upazilaId: string } & Partial<Upozila>>({
            query(data) {
                const { upazilaId, ...body } = data;
                return {
                    url: `upazilas/${upazilaId}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Upazilas', id }],
        }),

        deleteUpozila: build.mutation<{ success: boolean; upazilaId: string }, string>({
            query(upazilaId) {
                return {
                    url: `upazilas/${upazilaId}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: (result, error,upazilaId) => [{ type: 'Upazilas', upazilaId }],
        }),
    }),
});

export const {
    useGetUpazilasQuery,
    useAddUpozilaMutation,
    useGetUpozilaQuery,
    useUpdateUpozilaMutation,
    useDeleteUpozilaMutation,
    useGetAllUpazilasQuery
} = upozilaApi;
