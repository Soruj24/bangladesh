import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    divisionId: '',
    divisionName: '',
};

const divisionSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setDivisionId: (state, action) => {
            state.divisionId = action.payload;
        },
        setDivisionName: (state, action) => {
            state.divisionName = action.payload;
        },
    },
});

export const { setDivisionId, setDivisionName } = divisionSlice.actions;


export default divisionSlice.reducer;
