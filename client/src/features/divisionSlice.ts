import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    divisionId: '',
};

const divisionSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setDivisionId: (state, action) => {
            state.divisionId = action.payload;
        },
    },
});

export const { setDivisionId } = divisionSlice.actions;


export default divisionSlice.reducer;
