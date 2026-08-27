import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    accessToken: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isInitializing: true,
};

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isInitializing = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isInitializing = false;
        },
        setInitializing: (state, action: PayloadAction<boolean>) => {
            state.isInitializing = action.payload;
        },
    },
});

export const { setUser, logout, setInitializing } = userSlice.actions;

export default userSlice.reducer;
