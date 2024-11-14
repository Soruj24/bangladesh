import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../services/userApi';
import { divisionApi } from '../services/divisionApi';
import { villageApi } from '../services/villageApi';
import { unionApi } from '../services/unionApi';
import { upazilaApi } from '../services/upazilaApi';
import { districtApi } from '../services/districtApi';
import userReducer from '../features/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
    [divisionApi.reducerPath]: divisionApi.reducer,
    [villageApi.reducerPath]: villageApi.reducer,
    [unionApi.reducerPath]: unionApi.reducer,
    [upazilaApi.reducerPath]: upazilaApi.reducer,
    [districtApi.reducerPath]: districtApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        userApi.middleware,
        divisionApi.middleware,
        villageApi.middleware,
        unionApi.middleware,
        upazilaApi.middleware,
        districtApi.middleware
      ),
});

export default store;
