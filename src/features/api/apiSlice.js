// apiSlice.js
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {setCredentials} from '../auth/authSlice';
import {backend} from '../../util/backend';

const baseQuery = fetchBaseQuery({
    baseUrl: backend.baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },

});

export const refreshRequestConfig = {url: backend.refreshUrl, method: 'POST'};

const baseQueryWithReauth = async (args, api, extraOptions) => {
    try {
        if (!args) {
            return {error: {status: 400, message: 'Invalid request: Args is undefined'}};
        }
        else if (args?.error && !args?.method) {
            return args
        }
        else if (args?.url?.trim()?.endsWith('=') || args?.url?.trim()?.endsWith('undefined')) {
            return {error: {status: 400, message: 'Invalid request: Invalid request parameter'}};
        }

        let result = await baseQuery(args, api, extraOptions);
        if (result.error && result.error.status === 403 &&
            result.error.data?.error === "Failed but can refresh") {
            const refreshResult = await baseQuery(refreshRequestConfig, api, extraOptions);
            if (refreshResult?.data?.accessToken) {
                const user = api.getState().auth.user;
                const {accessToken} = refreshResult.data;
                api.dispatch(setCredentials({user, accessToken}));
                result = await baseQuery(args, api, extraOptions);
            }
        }
        return result;
    } catch (error) {
        console.error("Error caught in baseQueryWithReauth : ", error)
    }
};

// Define the apiSlice with the injected endpoints
export const apiSlice = createApi({
    reducerPath: 'api',
    // global configuration for the api
    keepUnusedDataFor: 10,
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Loan', 'Payment', 'Share', 'Responsibility', 'LoanRequest'],
    endpoints: builder => ({
        logout: builder.mutation({
            query: () => ({
                url: backend.logoutUrl,
                method: 'POST',
            }),
            invalidatesTags: ['User'], // Invalidate the 'User' tag upon logout
        }),
    }),
});

// Export the hook
export const {useLogoutMutation} = apiSlice;
