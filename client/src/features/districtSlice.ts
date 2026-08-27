import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    districtId: '',
    districtName: '',
};

const districtSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setDistrictId: (state, action) => {
            state.districtId = action.payload;
        },
        setDistrictName: (state, action) => {
            state.districtName = action.payload;
        },
    },
});

export const { setDistrictId , setDistrictName} = districtSlice.actions;


export default districtSlice.reducer;
