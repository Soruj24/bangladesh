import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        accessToken: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            localStorage.setItem('user', JSON.stringify(user));  // Store user in localStorage
            localStorage.setItem('accessToken', accessToken);     // Store accessToken in localStorage
        },
        logoutAction: (state) => {
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem('user');           // Remove user from localStorage
            localStorage.removeItem('accessToken');    // Remove accessToken from localStorage
        }
    },
});

export const { setUser, logoutAction } = userSlice.actions;
export default userSlice.reducer;
