import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const alipayAccountsAdapter = createEntityAdapter({
    selectId: (alipayAccount) => alipayAccount.alipayAccountId,
    sortComparer: (a, b) => b.alipayAccountId - a.alipayAccountId,
});

const initialState = alipayAccountsAdapter.getInitialState();

export const alipayAccountsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createAlipayAccount: builder.mutation({
            query: (alipayAccountInfo) => ({
                url: backend.alipayAccounts.createAccountUrl,
                method: 'POST',
                body: alipayAccountInfo, // Just pass the alipayAccountRequestInfo object directly
            }),
            invalidatesTags: [{type: 'AlipayAccount', id: 'LIST'}],
        }),
        getAllAlipayAccounts: builder.query({
            query: () => ({
                url: backend.alipayAccounts.getAllUrl,
                method: 'GET',
            }),
            transformResponse: (responseData) => {
                let alipayAccounts = responseData?.data?.alipayAccounts || [];
                return alipayAccountsAdapter.setAll(initialState, alipayAccounts);
            },
            providesTags: (result) =>
                result
                    ? [
                        {type: 'AlipayAccount', id: 'LIST'},
                        ...result.ids.map((id) => ({type: 'AlipayAccount', id})),
                    ]
                    : [{type: 'AlipayAccount', id: 'LIST'}],
        }),
        getAlipayAccountsByClientId: builder.query({
            query: (clientId) => {
                if (!Number(clientId) || clientId < 1) {
                    return {error: {status: 400, message: 'Invalid client ID'}};
                }
                return ({
                    url: `${backend.alipayAccounts.getAllByClientIdUrl}?clientId=${clientId}`,
                    method: 'GET',
                })
            },
            transformResponse: (responseData) => {
                let alipayAccounts = responseData?.data?.alipayAccounts || [];
                return alipayAccountsAdapter.setAll(initialState, alipayAccounts);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        {type: 'AlipayAccount', id: arg},
                        ...result.ids.map((id) => ({type: 'AlipayAccount', id})),
                    ]
                    : [{type: 'AlipayAccount', id: arg}],
        }),

        getAlipayAccountByAlipayAccountId: builder.query({
            query: (alipayAccountId) => {
                if (!Number(alipayAccountId) || alipayAccountId < 1) {
                    return {error: {status: 400, message: 'Invalid alipay account ID'}};
                }
                return ({
                url: `${backend.alipayAccounts.getByIdUrl}?alipayAccountId=${alipayAccountId}`,
                method: 'GET',
            })
            },
            transformResponse: (responseData) => {
                let alipayAccountArray = responseData?.data?.alipayAccount || [];
                alipayAccountArray = alipayAccountArray.map(alipayAccount => {
                    const timestamp = alipayAccount.requestDate;
                    let jsDate = new Date(timestamp);
                    return {
                        ...alipayAccount,
                        requestDate: jsDate.toISOString(),
                    };
                });
                return alipayAccountsAdapter.setAll(initialState, alipayAccountArray);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        {type: 'AlipayAccount', id: arg},
                        ...result.ids.map((id) => ({type: 'AlipayAccount', id})),
                    ]
                    : [{type: 'AlipayAccount', id: arg}],
        }),

        deleteAlipayAccount: builder.mutation({
            query: alipayAccount => ({
                url: `${backend.alipayAccounts.deleteUrl}/${alipayAccount.alipayAccountId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'AlipayAccount', id: arg.alipayAccountId},
                {type: 'AlipayAccount', id: 'LIST'},
            ],
        }),

    }),
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------

export const {
    useCreateAlipayAccountMutation,
    useGetAllAlipayAccountsQuery,
    useGetAlipayAccountsByClientIdQuery,
    useGetAlipayAccountByAlipayAccountIdQuery,
    useDeleteAlipayAccountMutation,
} = alipayAccountsApiSlice

//----------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------

export const selectAllAlipayAccountsResult = alipayAccountsApiSlice.endpoints.getAllAlipayAccounts.select()
export const selectAlipayAccountsForClientResult = (clientId) => alipayAccountsApiSlice.endpoints.getAlipayAccountsForClient.select(clientId)
export const selectAlipayAccountByAlipayAccountIdResult = (alipayAccountId) => alipayAccountsApiSlice.endpoints.getAlipayAccountByAlipayAccountId(alipayAccountId)

//----------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------

export const selectAllAlipayAccountsData = createSelector(
    selectAllAlipayAccountsResult,
    (allAlipayAccountsResult) => allAlipayAccountsResult.data
)

export const selectAlipayAccountsForClientData = (clientId) => createSelector(
    selectAlipayAccountsForClientResult(clientId),
    (alipayAccountsForClientResult) => alipayAccountsForClientResult.data
)

export const selectAlipayAccountByAlipayAccountIdData = (alipayAccountId) => createSelector(
    selectAlipayAccountByAlipayAccountIdResult(alipayAccountId),
    (alipayAccountByAlipayAccountIdResult) => alipayAccountByAlipayAccountIdResult.data
)

//----------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------

export const {
    selectAll: selectAllAlipayAccounts,
    selectById: selectAlipayAccountById,
    selectIds: selectAllAlipayAccountIds,
} = alipayAccountsAdapter.getSelectors((state) => selectAllAlipayAccountsData(state) ?? initialState);

export const {
    selectAll: selectAllIndividualAlipayAccounts,
    selectById: selectIndividualAlipayAccountById,
    selectIds: selectAllIndividualAlipayAccountIds,
} = alipayAccountsAdapter.getSelectors((state, clientId) => selectAlipayAccountsForClientData(clientId)(state) ?? initialState);

export const {
    selectAll: selectSingleLoanArray
} = alipayAccountsAdapter.getSelectors((state, alipayAccountId) => selectAlipayAccountByAlipayAccountIdData(alipayAccountId)(state) ?? initialState);
//----------------------------------------------------------------------------------------------------------------