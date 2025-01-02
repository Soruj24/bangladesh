import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    upazilaId: '',
};

const upazilaSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setUpazilaId: (state, action) => {
            state.upazilaId = action.payload;
        },
    },
});

export const { setUpazilaId } = upazilaSlice.actions;


export default upazilaSlice.reducer;
