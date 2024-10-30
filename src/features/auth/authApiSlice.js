import {apiSlice} from "../api/apiSlice";
import {refreshRequestConfig} from "../api/apiSlice";
import {backend} from "../../util/backend";
import {setItem} from "../../features/auth/authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: backend.loginUrl,
                method: 'POST',
                body: {...credentials}
            }),
            invalidatesTags: ['User'],
        }),
        logout: builder.mutation({
            queryFn: async (_, queryApi, __, baseQuery) => {
                try {
                    // Make the API call
                    const logoutResult = await baseQuery({
                        url: backend.logoutUrl,
                        method: 'POST',
                    });

                    // Handle API error
                    if (logoutResult.error) {
                        return {error: logoutResult.error};
                    }
                    queryApi.dispatch(setItem({key: "user", value: null}));
                    queryApi.dispatch(setItem({key: "token", value: null}));

                    return {data: logoutResult.data};
                } catch (error) {
                    console.log("Logout called error")
                    queryApi.dispatch(setItem({key: "user", value: null}));
                    queryApi.dispatch(setItem({key: "token", value: null}));
                    return {error: error};
                }
            },
            invalidatesTags: ['User', 'Token'],
        }),

        refresh: builder.mutation({
            queryFn: async (_, queryApi, __, baseQuery) => {
                const refreshResult = await baseQuery(refreshRequestConfig);
                if (refreshResult.error) {
                    return {error: refreshResult.error};
                }
                queryApi.dispatch(setItem({key: "user", value: refreshResult?.data?.data?.user}));
                queryApi.dispatch(setItem({key: "token", value: refreshResult?.data?.data?.token}));

                return {data: refreshResult.data};
            },
            invalidatesTags: ['User'],
        })
    })
})


export const {useLoginMutation, useLogoutMutation, useRefreshMutation} = authApiSlice;
