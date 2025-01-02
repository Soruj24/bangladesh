import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    districtId: '',
};

const districtSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setDistrictId: (state, action) => {
            state.districtId = action.payload;
        },
    },
});

export const { setDistrictId } = districtSlice.actions;


export default districtSlice.reducer;
