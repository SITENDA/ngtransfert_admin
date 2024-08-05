import { apiSlice } from "../api/apiSlice";
import { refreshRequestConfig } from "../api/apiSlice";
import { backend } from "../../util/backend";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: backend.loginUrl,
                method: 'POST',
                body: { ...credentials }
            }),
            invalidatesTags: ['User'],
        }),
        contact: builder.mutation({
            query: contactInfo => ({
                url: backend.contactUrl,
                method: 'POST',
                body: { ...contactInfo }
            }),
            invalidatesTags: ['Contact'],
        }),
        logout: builder.mutation({
            query: credentials => ({
                url: backend.logoutUrl,
                method: 'POST',
                // body: { ...credentials }
            }),
            invalidatesTags: ['User'],
        }),

        refresh: builder.mutation({
            queryFn: async (_, queryApi, __, baseQuery) => {
                const refreshResult = await baseQuery(refreshRequestConfig);
                if (refreshResult.error) {
                    console.error('Refresh token request error:', refreshResult.error);
                    return { error: refreshResult.error };
                }
                return { data: refreshResult.data };
            },
            invalidatesTags: ['User'],
        }),
        getAvatar: builder.query({
            query: (filename) => ({
                url: backend.avatarUrl,
                method: 'GET'
            }),
          }),
    })
})


export const {
        useLoginMutation,
        useContactMutation,
        useLogoutMutation,
        useRefreshMutation,
        useGetAvatarQuery
    } = authApiSlice;
