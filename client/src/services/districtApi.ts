import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export interface District {
    id: string;
    name: string;
    _id?: string;
}

type DistrictsResponse = { division: { districts: District[] } } | District[];

export const districtApi = createApi({
    reducerPath: 'districtsApi',
    baseQuery,
    tagTypes: ['Districts'],
    endpoints: (build) => ({
        getDistricts: build.query<DistrictsResponse, string>({
            query: (divisionId) => `districts/${divisionId}`,
            providesTags: [{ type: 'Districts', id: 'LIST' }],
        }),

        getAllDistricts: build.query<{ district: District[] }, void>({
            query: () => 'districts',
            providesTags: [{ type: 'Districts', id: 'LIST' }],
        }),

        addDistrict: build.mutation<District, { name: string; divisionId: string }>({
            query: ({ name, divisionId }) => ({
                url: `districts/${divisionId}`,
                method: 'POST',
                body: { name },
            }),
            invalidatesTags: [{ type: 'Districts', id: 'LIST' }],
        }),

        getDistrict: build.query<District, { divisionId: string; districtId: string }>({
            query: ({ divisionId, districtId }) => `district/${divisionId}/${districtId}`,
            providesTags: (_result, _error, { districtId }) => [{ type: 'Districts', id: districtId }],
        }),

        updateDistrict: build.mutation<District, { districtId: string; name: string }>({
            query: ({ districtId, ...body }) => ({
                url: `districts/${districtId}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (_result, _error, { districtId }) => [{ type: 'Districts', id: districtId }],
        }),

        deleteDistrict: build.mutation<{ success: boolean }, { districtId: string }>({
            query: ({ districtId }) => ({
                url: `districts/${districtId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { districtId }) => [{ type: 'Districts', id: districtId }],
        }),
    }),
});

export const {
    useGetDistrictsQuery,
    useAddDistrictMutation,
    useGetDistrictQuery,
    useUpdateDistrictMutation,
    useDeleteDistrictMutation,
    useGetAllDistrictsQuery,
} = districtApi;
