import {configureStore} from "@reduxjs/toolkit";
import {apiSlice} from "../features/api/apiSlice";
import authReducer from "../features/auth/authSlice";
import {backend} from "../util/backend";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: backend.env === 'production' ? false : true
});
