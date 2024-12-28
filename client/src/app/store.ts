import { userApi } from '@/services/userApi'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '../features/userSlice'
import { divisionApi } from '@/services/dividionApi'

export const store = configureStore({
    reducer: {

        auth: authReducer,

        [userApi.reducerPath]: userApi.reducer,
        [divisionApi.reducerPath]: divisionApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(divisionApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
