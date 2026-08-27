import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Upozila {
    id: string;
    name: string;
    _id: string;
}

type UpazilasResponse = { upazila: Upozila[] } | { UpazilaWithOutDistrict: Upozila[] } | Upozila[];

export const upozilaApi = createApi({
    reducerPath: 'upozilasApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api', credentials: 'include' }),
    tagTypes: ['Upazilas'],
    endpoints: (build) => ({
        getUpazilas: build.query<UpazilasResponse, { divisionId: string; districtId: string }>({
            query: ({ divisionId, districtId }) => `upazilas/${divisionId}/${districtId}`,
            providesTags: [{ type: 'Upazilas', id: 'LIST' }],
        }),

        getAllUpazilas: build.query<{ UpazilaWithOutDistrict: Upozila[] }, void>({
            query: () => 'upazilas/withOutDistrict',
            providesTags: [{ type: 'Upazilas', id: 'LIST' }],
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
            providesTags: (_result, _error, id) => [{ type: 'Upazilas', id }],
        }),

        updateUpozila: build.mutation<Upozila, { upazilaId: string; name: string }>({
            query({ upazilaId, ...body }) {
                return {
                    url: `upazilas/${upazilaId}`,
                    method: 'PUT',
                    body,
                };
            },
            invalidatesTags: [{ type: 'Upazilas', id: 'LIST' }],
        }),

        deleteUpozila: build.mutation<{ success: boolean }, string>({
            query(upazilaId) {
                return {
                    url: `upazilas/${upazilaId}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: [{ type: 'Upazilas', id: 'LIST' }],
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
