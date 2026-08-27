import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GeoState {
  divisionId: string;
  divisionName: string;
  districtId: string;
  districtName: string;
  upazilaId: string;
  upazilaName: string;
  unionId: string;
  unionName: string;
  villageId: string;
  villageName: string;
}

const initialState: GeoState = {
  divisionId: '',
  divisionName: '',
  districtId: '',
  districtName: '',
  upazilaId: '',
  upazilaName: '',
  unionId: '',
  unionName: '',
  villageId: '',
  villageName: '',
};

const geoSlice = createSlice({
  name: 'geo',
  initialState,
  reducers: {
    setDivisionId: (state, action: PayloadAction<string>) => {
      state.divisionId = action.payload;
    },
    setDivisionName: (state, action: PayloadAction<string>) => {
      state.divisionName = action.payload;
    },
    setDistrictId: (state, action: PayloadAction<string>) => {
      state.districtId = action.payload;
    },
    setDistrictName: (state, action: PayloadAction<string>) => {
      state.districtName = action.payload;
    },
    setUpazilaId: (state, action: PayloadAction<string>) => {
      state.upazilaId = action.payload;
    },
    setUpazilaName: (state, action: PayloadAction<string>) => {
      state.upazilaName = action.payload;
    },
    setUnionId: (state, action: PayloadAction<string>) => {
      state.unionId = action.payload;
    },
    setUnionName: (state, action: PayloadAction<string>) => {
      state.unionName = action.payload;
    },
    setVillageId: (state, action: PayloadAction<string>) => {
      state.villageId = action.payload;
    },
    setVillageName: (state, action: PayloadAction<string>) => {
      state.villageName = action.payload;
    },
    resetGeo: () => initialState,
  },
});

export const {
  setDivisionId,
  setDivisionName,
  setDistrictId,
  setDistrictName,
  setUpazilaId,
  setUpazilaName,
  setUnionId,
  setUnionName,
  setVillageId,
  setVillageName,
  resetGeo,
} = geoSlice.actions;

export default geoSlice.reducer;
