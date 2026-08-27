import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface PublicStats {
  divisions: number;
  districts: number;
  upazilas: number;
  unions: number;
  villages: number;
  population: number;
}

interface PublicDivision {
  _id: string;
  name: string;
}

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api/public" }),
  endpoints: (build) => ({
    getStats: build.query<{ payload: PublicStats }, void>({
      query: () => "stats",
    }),
    getDivisions: build.query<{ payload: { divisions: PublicDivision[] } }, void>({
      query: () => "divisions",
    }),
  }),
});

export const { useGetStatsQuery, useGetDivisionsQuery: useGetPublicDivisionsQuery } = publicApi;
