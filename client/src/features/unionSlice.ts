import { createSlice } from '@reduxjs/toolkit';
 
const initialState = {
    unionId: '',
    unionName: '',
};


const unionSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setUnionId: (state, action) => {
            state.unionId = action.payload;
        },
        setUnionName: (state, action) => {
            state.unionName = action.payload;
        }
    },
});

export const { setUnionId, setUnionName } = unionSlice.actions;


export default unionSlice.reducer;
