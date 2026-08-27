import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export interface Village {
    id: string;
    name: string;
    _id: string;
    value: string;
    label: string;
}

interface GetVillagesParams {
    divisionId: string;
    districtId: string;
    upazilaId: string;
    unionId: string;
}

interface AddVillageParams {
    divisionId: string;
    districtId: string;
    upazilaId: string;
    unionId: string;
    name: string;
}

export const villageApi = createApi({
    reducerPath: 'villagesApi',
    baseQuery,
    tagTypes: ['Villages'],
    endpoints: (build) => ({
        getVillages: build.query<{ villages: Village[] }, GetVillagesParams>({
            query: ({ divisionId, districtId, upazilaId, unionId }) =>
                `villages/${divisionId}/${districtId}/${upazilaId}/${unionId}`,
            providesTags: [{ type: 'Villages', id: 'LIST' }],
        }),

        getAllVillages: build.query<{ villagesWithOutUnion: Village[] }, void>({
            query: () => 'villages/villagesWithOutUnion',
            providesTags: [{ type: 'Villages', id: 'LIST' }],
        }),

        addVillage: build.mutation<Village, AddVillageParams>({
            query: ({ divisionId, districtId, upazilaId, unionId, name }) => ({
                url: `villages/${divisionId}/${districtId}/${upazilaId}/${unionId}`,
                method: 'POST',
                body: { name },
            }),
            invalidatesTags: [{ type: 'Villages', id: 'LIST' }],
        }),

        getVillage: build.query<Village, string>({
            query: (id) => `village/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Villages', id }],
        }),

        updateVillage: build.mutation<Village, { id: string; name: string }>({
            query: ({ id, ...body }) => ({
                url: `villages/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'Villages', id: 'LIST' }],
        }),

        deleteVillage: build.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `villages/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Villages', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetVillagesQuery,
    useAddVillageMutation,
    useGetVillageQuery,
    useUpdateVillageMutation,
    useDeleteVillageMutation,
    useGetAllVillagesQuery,
} = villageApi;
