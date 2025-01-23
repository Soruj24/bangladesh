import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface District {
    id: string;
    name: string;
}

type DistrictsResponse = District[];

export const districtApi = createApi({
    reducerPath: 'districtsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
    tagTypes: ['Districts'],
    endpoints: (build) => ({
        getDistricts: build.query<DistrictsResponse, { divisionId: string }>({
            query: (divisionId) => `districts/${divisionId}`,
            providesTags: (result) =>
                Array.isArray(result) && result.length > 0 
                    ? [
                        ...result.map(({ id }) => ({ type: 'Districts', id } as const)),
                        { type: 'Districts', id: 'LIST' },
                    ]
                    : [{ type: 'Districts', id: 'LIST' }],

        }),

        getAllDistricts: build.query<DistrictsResponse, void>({
            query: () => 'districts',
            providesTags: (result) =>
                Array.isArray(result) && result.length > 0 
                    ? [
                        ...result.map(({ id }) => ({ type: 'Districts', id } as const)),
                        { type: 'Districts', id: 'LIST' },
                    ]
                    : [{ type: 'Districts', id: 'LIST' }],
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
            providesTags: (result, error, { districtId }) => [{ type: 'Districts', id: districtId }],
        }),
        updateDistrict: build.mutation<
            District,
            {  districtId: string; name: string }
        >({
            query: ({ districtId, ...body }) => ({
                url: `districts/${districtId}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { districtId }) => [{ type: 'Districts', id: districtId }],
        }),
        deleteDistrict: build.mutation<{ success: boolean }, {  districtId: string }>(
            {
                query: ({  districtId }) => ({
                    url: `districts/${districtId}`,
                    method: 'DELETE',
                }),
                invalidatesTags: (result, error, { districtId }) => [{ type: 'Districts', id: districtId }],
            }
        ),
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
