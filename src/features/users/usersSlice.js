import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { backend } from "../../util/backend";

const usersAdapter = createEntityAdapter({
    selectId: (user) => user.userId,
    sortComparer: (a, b) => b.userId - a.userId
});

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        register: builder.mutation({
            query: initialUser => ({
                url: backend.registerUrl,
                method: 'POST',
                body: {
                    ...initialUser,
                }
            })
        }),

        getAllUsers: builder.query({
            query: () => backend.users.getAllUrl,
            transformResponse: responseData => {
                if (responseData?.data?.users) {
                    const users = responseData.data.users
                    return usersAdapter.setAll(initialState, users)
                }
            },
            providesTags: (result, error, arg) => [
                { type: 'User', id: "LIST" },
                ...result.ids.map(id => ({ type: 'User', id }))
            ]
        }),

        getAllClients: builder.query({
            query: () => backend.users.getAllClientsUrl,
            transformResponse: responseData => {
                if (responseData?.data?.clients) {
                    const clients = responseData.data.clients
                    clients.map(client => {
                        if (!client?.numberOfLoans || client.numberOfLoans === 0) client.numberOfLoans = "none"
                        return client
                    })
                    return usersAdapter.setAll(initialState, clients)
                }
            },
            providesTags: (result, error, arg) => [
                { type: 'User', id: "LIST" },
                ...result.ids.map(id => ({ type: 'Client', id }))
            ]
        }),
        getUserByUserId: builder.query({
            query: (userId) => `${backend.users.getByUserIdUrl}?userId=${userId}`,
            transformResponse: responseData => {
                const user = responseData?.data?.user;
                // Check if user exists and is an object
                if (user && typeof user === 'object') {
                    // Iterate over keys of user object
                    Object.keys(user).forEach(key => {
                        // Check if key value is unset (undefined or null)
                        if (user[key] === undefined || user[key] === null) {
                            // Set unset key to "Unset"
                            user[key] = "Unset";
                        }
                    });
                }
                return usersAdapter.setAll(initialState, [user]); // Return the payment object directly
            },
            providesTags: (result, error, arg) => [
                { type: 'User', id: 'LIST' },
                ...result.ids.map(id => ({ type: 'User', id }))
            ],

        }),
        submitMoreClientInfo: builder.mutation({
            query: moreInfo => ({
                url: backend.users.submitMoreClientInfoUrl,
                method: 'PUT',
                body: moreInfo
            }),
            invalidatesTags: [
                { type: 'User', id: 'LIST' },
                { type: 'LoanRequest', id: 'LIST' }
            ],
        }),

        getUserById: builder.query({
            query: (request) => ({
                url: backend.users.getAllByClientIdUrl,
                method: 'GET',
                params: request,
            }),
            transformResponse: responseData => {
                console.log('Response data before normalization:', responseData);
                return usersAdapter.setAll(initialState, responseData);
            },
            providesTags: (result, error, arg) => [
                ...result.ids.map(id => ({ type: 'User', id }))
            ]
        }),

        deleteUser: builder.mutation({
            query: user => ({
                url: `${backend.users.deleteUserUrl}/${user.userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.userId },
                { type: 'User', id: 'LIST' }
            ]
        }),
    })
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------
export const {
    useRegisterMutation,
    useGetUserByIdQuery,
    useGetAllUsersQuery,
    useGetAllClientsQuery,
    useGetUserByUserIdQuery,
    useSubmitMoreClientInfoMutation,
    useDeleteUserMutation
} = usersApiSlice
//------------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------
export const selectAllUsersResult = usersApiSlice.endpoints.getAllUsers.select()
export const selectAllClientsResult = usersApiSlice.endpoints.getAllClients.select()
//------------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------
//  returns normalized state object with ids & entities
export const selectAllUsersData = createSelector(
    selectAllUsersResult,
    allUsersResult => {
        return allUsersResult.data //normalized state object with ids & entities
    }
)
export const selectAllClientsData = createSelector(
    selectAllClientsResult,
    allClientsResult => {
        return allClientsResult.data
    }
)
//------------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectAllUserIds

} = usersAdapter.getSelectors(state => selectAllUsersData(state) ?? initialState)
export const {
    selectAll: selectAllClients,
    selectById: selectClientById,
    selectIds: selectAllClientIds

} = usersAdapter.getSelectors(state => selectAllClientsData(state) ?? initialState)
//------------------------------------------------------------------------------------------------------------------
