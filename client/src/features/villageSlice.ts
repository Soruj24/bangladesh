import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    villageId: '',
    villageName: '',
};

const villageSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setVillageId: (state, action) => {
            state.villageId = action.payload;
        },
        setVillageName: (state, action) => {
            state.villageName = action.payload;
        }
    },
});

export const { setVillageId , setVillageName} = villageSlice.actions;


export default villageSlice.reducer;
