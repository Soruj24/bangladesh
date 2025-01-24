import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    upazilaId: '',
    upazilaName: '',
};

const upazilaSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setUpazilaId: (state, action) => {
            state.upazilaId = action.payload;
        },
        setUpazilaName: (state, action) => {
            state.upazilaName = action.payload;
        }
    },
});

export const { setUpazilaId , setUpazilaName} = upazilaSlice.actions;


export default upazilaSlice.reducer;
