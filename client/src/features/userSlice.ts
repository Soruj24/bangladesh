import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely parse JSON
const safeParseJSON = (value: string | null) => {
    try {
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        return null;
    }
};

// Define the initial state
const initialState = {
    user: safeParseJSON(localStorage.getItem('user')),
    isAuthenticated: !!localStorage.getItem('token'), // Check if a token exists
};

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('token', state.user?.accessToken || '');
            localStorage.setItem('accessToken', state.user?.accessToken || '');
            localStorage.setItem('refreshToken', state.user?.refreshToken || '');
            localStorage.setItem('user', JSON.stringify(state.user || {})); // Store user in localStorage
        },
        
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user'); // Remove user from localStorage
        },
    },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
