import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the auth state
interface AuthState {
    user: User | null;
    token: string | null;
}

interface User {
    id: number;
    name: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
}

// Retrieve initial state from localStorage
const storedUser: User | null = JSON.parse(localStorage.getItem("user") || "null");
const storedToken: string | null = localStorage.getItem("accessToken");

const initialState: AuthState = {
    user: storedUser,
    token: storedToken,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User }>) => {
            const { user } = action.payload;
            state.user = user;
            state.token = user.accessToken || null;

            // Save to localStorage
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", user.accessToken || "");
            localStorage.setItem("refreshToken", user.refreshToken || "");
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;

            // Remove from localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }): User | null => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }): string | null => state.auth.token;
