import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const wechatAccountsAdapter = createEntityAdapter({
    selectId: (wechatAccount) => wechatAccount.wechatAccountId,
    sortComparer: (a, b) => b.wechatAccountId - a.wechatAccountId,
});

const initialState = wechatAccountsAdapter.getInitialState();

export const wechatAccountsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createWechatAccount: builder.mutation({
            query: (wechatAccountInfo) => ({
                url: backend.wechatAccounts.createAccountUrl,
                method: 'POST',
                body: wechatAccountInfo, // Just pass the wechatAccountRequestInfo object directly
            }),
            invalidatesTags: [{type: 'WechatAccount', id: 'LIST'}],
        }),
        getAllWechatAccounts: builder.query({
            query: () => ({
                url: backend.wechatAccounts.getAllUrl,
                method: 'GET',
            }),
            transformResponse: (responseData) => {
                let wechatAccounts = responseData?.data?.wechatAccounts || [];
                return wechatAccountsAdapter.setAll(initialState, wechatAccounts);
            },
            providesTags: (result) =>
                result
                    ? [
                        {type: 'WechatAccount', id: 'LIST'},
                        ...result.ids.map((id) => ({type: 'WechatAccount', id})),
                    ]
                    : [{type: 'WechatAccount', id: 'LIST'}],
        }),
        getWechatAccountsForClient: builder.query({
            query: (wechatAccountId) => ({
                url: `${backend.wechatAccounts.getAllByClientIdUrl }?wechatAccountId=${wechatAccountId}`,
                method: 'GET',
            }),
            transformResponse: (responseData) => {
                let wechatAccounts = responseData?.data?.wechatAccounts || [];
                return wechatAccountsAdapter.setAll(initialState, wechatAccounts);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        { type: 'WechatAccount', id: arg },
                        ...result.ids.map((id) => ({ type: 'WechatAccount', id })),
                    ]
                    : [{ type: 'WechatAccount', id: arg }],
        }),

        getWechatAccountByWechatAccountId: builder.query({
            query: (wechatAccountId) => ({
                url: `${backend.wechatAccounts.getByIdUrl}?wechatAccountId=${wechatAccountId}`,
                method: 'GET',
            }),
            transformResponse: (responseData) => {
                let wechatAccountArray = responseData?.data?.wechatAccount || [];
                wechatAccountArray = wechatAccountArray.map(wechatAccount => {
                    const timestamp = wechatAccount.requestDate;
                    let jsDate = new Date(timestamp);
                    return {
                        ...wechatAccount,
                        requestDate: jsDate.toISOString(),
                    };
                });
                return wechatAccountsAdapter.setAll(initialState, wechatAccountArray);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        { type: 'WechatAccount', id: arg },
                        ...result.ids.map((id) => ({ type: 'WechatAccount', id })),
                    ]
                    : [{ type: 'WechatAccount', id: arg }],
        }),
        
        deleteWechatAccount: builder.mutation({
            query: wechatAccount => ({
                url: `${backend.wechatAccounts.deleteUrl}/${wechatAccount.wechatAccountId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'WechatAccount', id: arg.wechatAccountId },
                { type: 'WechatAccount', id: 'LIST' },
            ],
        }),

    }),
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------

export const {
    useCreateWechatAccountMutation,
    useGetAllWechatAccountsQuery,
    useGetWechatAccountsForClientQuery,
    useGetWechatAccountByWechatAccountIdQuery,
    useDeleteWechatAccountMutation,
} = wechatAccountsApiSlice

//----------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------

export const selectAllWechatAccountsResult = wechatAccountsApiSlice.endpoints.getAllWechatAccounts.select()
export const selectWechatAccountsForClientResult = (clientId) => wechatAccountsApiSlice.endpoints.getWechatAccountsForClient.select(clientId)
export const selectWechatAccountByWechatAccountIdResult = (clientId) => wechatAccountsApiSlice.endpoints.getWechatAccountByWechatAccountId(clientId)

//----------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------

export const selectAllWechatAccountsData = createSelector(
    selectAllWechatAccountsResult,
    (allWechatAccountsResult) => allWechatAccountsResult.data
)

export const selectWechatAccountsForClientData = (clientId) => createSelector(
    selectWechatAccountsForClientResult(clientId),
    (wechatAccountsForClientResult) => wechatAccountsForClientResult.data
)

export const selectWechatAccountByWechatAccountIdData = (wechatAccountId) => createSelector(
    selectWechatAccountByWechatAccountIdResult(wechatAccountId),
    (wechatAccountByWechatAccountIdResult) => wechatAccountByWechatAccountIdResult.data
)

//----------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------

export const {
    selectAll: selectAllWechatAccounts,
    selectById: selectWechatAccountById,
    selectIds: selectAllWechatAccountIds,
} = wechatAccountsAdapter.getSelectors((state) => selectAllWechatAccountsData(state) ?? initialState);

export const {
    selectAll: selectAllIndividualWechatAccounts,
    selectById: selectIndividualWechatAccountById,
    selectIds: selectAllIndividualWechatAccountIds,
} = wechatAccountsAdapter.getSelectors((state, clientId) => selectWechatAccountsForClientData(clientId)(state) ?? initialState);

export const {
    selectAll: selectSingleLoanArray
} = wechatAccountsAdapter.getSelectors((state, wechatAccountId) => selectWechatAccountByWechatAccountIdData(wechatAccountId)(state) ?? initialState);
//----------------------------------------------------------------------------------------------------------------