import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface District {
    id: number
    name: string
}

type DistrictsResponse = District[]

export const districtApi = createApi({
    reducerPath: 'districtsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    tagTypes: ['Districts'],
    endpoints: (build) => ({
        getDistricts: build.query<DistrictsResponse, void>({
            query: () => 'districts',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Districts', id }) as const),
                        { type: 'Districts', id: 'LIST' },
                    ]
                    : [{ type: 'Districts', id: 'LIST' }],
        }),
        addDistrict: build.mutation<District, Partial<District>>({
            query(body) {
                return {
                    url: `district`,
                    method: 'POST',
                    body,
                }
            },
            invalidatesTags: [{ type: 'Districts', id: 'LIST' }],
        }),
        getDistrict: build.query<District, number>({
            query: (id) => `district/${id}`,
            providesTags: (result, error, id) => [{ type: 'Districts', id }],
        }),
        updateDistrict: build.mutation<District, Partial<District>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `district/${id}`,
                    method: 'PUT',
                    body,
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Districts', id }],
        }),
        deleteDistrict: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `district/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Districts', id }],
        }),
    }),
})

export const {
    useGetDistrictsQuery,
    useAddDistrictMutation,
    useGetDistrictQuery,
    useUpdateDistrictMutation,
    useDeleteDistrictMutation,
} = districtApi
