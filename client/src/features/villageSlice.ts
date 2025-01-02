import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    villageId: '',
};

const villageSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setVillageId: (state, action) => {
            state.villageId = action.payload;
        },
    },
});

export const { setVillageId } = villageSlice.actions;


export default villageSlice.reducer;
