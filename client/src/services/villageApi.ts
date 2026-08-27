import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Village {
    id: string;
    name: string;
}

type VillagesResponse = Village[];

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
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api', credentials: 'include' }),
    tagTypes: ['Villages'],
    endpoints: (build) => ({
        getVillages: build.query<VillagesResponse, GetVillagesParams>({
            query: ({ divisionId, districtId, upazilaId, unionId }) =>
                `villages/${divisionId}/${districtId}/${upazilaId}/${unionId}`,
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Villages' as const, id })),
                        { type: 'Villages' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Villages' as const, id: 'LIST' }],
        }),

        getAllVillages: build.query<VillagesResponse, void>({
            query: () => 'villages/villagesWithOutUnion',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Villages' as const, id })),
                        { type: 'Villages' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Villages' as const, id: 'LIST' }],
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

        updateVillage: build.mutation<Village, Partial<Village>>({
            query: ({ id, ...body }) => ({
                url: `villages/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Villages', id }],
        }),

        deleteVillage: build.mutation<{ success: boolean; id: string }, string>({
            query: (id) => ({
                url: `villages/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Villages', id }],
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
