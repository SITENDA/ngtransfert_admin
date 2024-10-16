import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const receiverAccountsAdapter = createEntityAdapter({
    selectId: (receiverAccount) => receiverAccount.receiverAccountId,
    sortComparer: (a, b) => b.receiverAccountId - a.receiverAccountId,
});

const initialState = receiverAccountsAdapter.getInitialState();

export const receiverAccountsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createReceiverAccount: builder.mutation({
            query: (receiverAccountInfo) => ({
                url: backend.receiverAccounts.createAccountUrl,
                method: 'POST',
                body: receiverAccountInfo,
            }),
            invalidatesTags: [{type: 'ReceiverAccount', id: 'LIST'}],
        }),
        getAllReceiverAccounts: builder.query({
            query: () => ({
                url: backend.receiverAccounts.getAllUrl,
                method: 'GET',
            }),
            transformResponse: (responseData) => {
                let receiverAccounts = responseData?.data?.receiverAccounts || [];
                return receiverAccountsAdapter.setAll(initialState, receiverAccounts);
            },
            providesTags: (result) =>
                result
                    ? [
                        {type: 'ReceiverAccount', id: 'LIST'},
                        ...result.ids.map((id) => ({type: 'ReceiverAccount', id})),
                    ]
                    : [{type: 'ReceiverAccount', id: 'LIST'}],
        }),
        getReceiverAccountsByClientId: builder.query({
            query: (clientId) => {
                if (!Number(clientId) || clientId < 1) {
                    return {error: {status: 400, message: 'Invalid client ID'}};
                }
                return ({
                    url: `${backend.receiverAccounts.getAllByClientIdUrl}?clientId=${clientId}`,
                    method: 'GET',
                })
            },
            transformResponse: (responseData) => {
                let receiverAccounts = responseData?.data?.receiverAccounts || [];
                return receiverAccountsAdapter.setAll(initialState, receiverAccounts);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        {type: 'ReceiverAccount', id: arg},
                        ...result.ids.map((id) => ({type: 'ReceiverAccount', id})),
                    ]
                    : [{type: 'ReceiverAccount', id: arg}],
        }),

        getReceiverAccountByReceiverAccountId: builder.query({
            query: (receiverAccountId) => {
                if (!Number(receiverAccountId) || receiverAccountId < 1) {
                    return {error: {status: 400, message: 'Invalid receiver account ID'}};
                }
                return ({
                url: `${backend.receiverAccounts.getByIdUrl}?receiverAccountId=${receiverAccountId}`,
                method: 'GET',
            })
            },
            transformResponse: (responseData) => {
                let receiverAccountArray = responseData?.data?.receiverAccount || [];
                receiverAccountArray = receiverAccountArray.map(receiverAccount => {
                    const timestamp = receiverAccount.requestDate;
                    let jsDate = new Date(timestamp);
                    return {
                        ...receiverAccount,
                        requestDate: jsDate.toISOString(),
                    };
                });
                return receiverAccountsAdapter.setAll(initialState, receiverAccountArray);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        {type: 'ReceiverAccount', id: arg},
                        ...result.ids.map((id) => ({type: 'ReceiverAccount', id})),
                    ]
                    : [{type: 'ReceiverAccount', id: arg}],
        }),

        deleteReceiverAccount: builder.mutation({
            query: receiverAccount => ({
                url: `${backend.receiverAccounts.deleteUrl}/${receiverAccount.receiverAccountId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'ReceiverAccount', id: arg.receiverAccountId},
                {type: 'ReceiverAccount', id: 'LIST'},
            ],
        }),

    }),
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------

export const {
    useCreateReceiverAccountMutation,
    useGetAllReceiverAccountsQuery,
    useGetReceiverAccountsByClientIdQuery,
    useGetReceiverAccountByReceiverAccountIdQuery,
    useDeleteReceiverAccountMutation,
} = receiverAccountsApiSlice

//----------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------

export const selectAllReceiverAccountsResult = receiverAccountsApiSlice.endpoints.getAllReceiverAccounts.select()
export const selectReceiverAccountsForClientResult = (clientId) => receiverAccountsApiSlice.endpoints.getReceiverAccountsByClientId.select(clientId)
export const selectReceiverAccountByReceiverAccountIdResult = (receiverAccountId) => receiverAccountsApiSlice.endpoints.getReceiverAccountByReceiverAccountId(receiverAccountId)

//----------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------

export const selectAllReceiverAccountsData = createSelector(
    selectAllReceiverAccountsResult,
    (allReceiverAccountsResult) => allReceiverAccountsResult.data
)

export const selectReceiverAccountsForClientData = (clientId) => createSelector(
    selectReceiverAccountsForClientResult(clientId),
    (receiverAccountsForClientResult) => receiverAccountsForClientResult.data
)

export const selectReceiverAccountByReceiverAccountIdData = (receiverAccountId) => createSelector(
    selectReceiverAccountByReceiverAccountIdResult(receiverAccountId),
    (receiverAccountByReceiverAccountIdResult) => receiverAccountByReceiverAccountIdResult.data
)

//----------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------

export const {
    selectAll: selectAllReceiverAccounts,
    selectById: selectReceiverAccountById,
    selectIds: selectAllReceiverAccountIds,
} = receiverAccountsAdapter.getSelectors((state) => selectAllReceiverAccountsData(state) ?? initialState);

export const {
    selectAll: selectAllIndividualReceiverAccounts,
    selectById: selectIndividualReceiverAccountById,
    selectIds: selectAllIndividualReceiverAccountIds,
} = receiverAccountsAdapter.getSelectors((state, clientId) => selectReceiverAccountsForClientData(clientId)(state) ?? initialState);

export const {
    selectAll: selectSingleLoanArray
} = receiverAccountsAdapter.getSelectors((state, receiverAccountId) => selectReceiverAccountByReceiverAccountIdData(receiverAccountId)(state) ?? initialState);
//----------------------------------------------------------------------------------------------------------------