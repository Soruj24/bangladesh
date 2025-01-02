import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    unionId: '',
};


const unionSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setUnionId: (state, action) => {
            state.unionId = action.payload;
        },
    },
});

export const { setUnionId } = unionSlice.actions;


export default unionSlice.reducer;
