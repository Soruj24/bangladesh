import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Village {
    id: number;
    name: string;
}

type VillagesResponse = Village[];

// Input type for fetching villages based on hierarchical IDs
interface GetVillagesParams {
    divisionId: number;
    districtId: number;
    upazilaId: number;
    unionId: number;
}

// Input type for adding a new village
interface AddVillageParams {
    divisionId: number;
    districtId: number;
    upazilaId: number;
    unionId: number;
    name: string;
}

export const villageApi = createApi({
    reducerPath: 'villagesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }), // Adjust base URL if necessary
    tagTypes: ['Villages'],
    endpoints: (build) => ({
        getVillages: build.query<VillagesResponse, GetVillagesParams>({
            query: ({ divisionId, districtId, upazilaId, unionId }) =>
                `villages/${divisionId}/${districtId}/${upazilaId}/${unionId}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Villages', id } as const)),
                        { type: 'Villages', id: 'LIST' },
                    ]
                    : [{ type: 'Villages', id: 'LIST' }],
        }),
        addVillage: build.mutation<Village, AddVillageParams>({
            query: ({ divisionId, districtId, upazilaId, unionId, name }) => ({
                url: `villages/${divisionId}/${districtId}/${upazilaId}/${unionId}`,
                method: 'POST',
                body: { name },
            }),
            invalidatesTags: [{ type: 'Villages', id: 'LIST' }],
        }),
        getVillage: build.query<Village, number>({
            query: (id) => `village/${id}`,
            providesTags: (result, error, id) => [{ type: 'Villages', id }],
        }),
        updateVillage: build.mutation<Village, Partial<Village>>({
            query: ({ id, ...body }) => ({
                url: `village/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Villages', id }],
        }),
        deleteVillage: build.mutation<{ success: boolean; id: number }, number>({
            query: (id) => ({
                url: `village/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Villages', id }],
        }),
    }),
});

export const {
    useGetVillagesQuery,
    useAddVillageMutation,
    useGetVillageQuery,
    useUpdateVillageMutation,
    useDeleteVillageMutation,
} = villageApi;
