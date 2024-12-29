import { userApi } from '@/services/userApi'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '../features/userSlice'
import { divisionApi } from '@/services/dividionApi'
import { districtApi } from '@/services/districtApi'
import { upozilaApi } from '@/services/upozilaApi'
import { unionApi } from '@/services/unionsApi'
import { villageApi } from '@/services/villageApi'
import { populationApi } from '@/services/populationApi'

export const store = configureStore({
    reducer: {

        auth: authReducer,

        [userApi.reducerPath]: userApi.reducer,
        [divisionApi.reducerPath]: divisionApi.reducer,
        [districtApi.reducerPath]: districtApi.reducer,
        [upozilaApi.reducerPath]: upozilaApi.reducer,
        [unionApi.reducerPath]: unionApi.reducer,
        [villageApi.reducerPath]: villageApi.reducer,
        [populationApi.reducerPath]: populationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(divisionApi.middleware)
            .concat(districtApi.middleware)
            .concat(upozilaApi.middleware)
            .concat(unionApi.middleware)
            .concat(villageApi.middleware)
            .concat(populationApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
