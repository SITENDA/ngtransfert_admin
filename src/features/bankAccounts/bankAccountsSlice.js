import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const bankAccountsAdapter = createEntityAdapter({
    selectId: (bankAccount) => bankAccount.bankAccountId,
    sortComparer: (a, b) => b.bankAccountId - a.bankAccountId,
});

const initialState = bankAccountsAdapter.getInitialState();

export const bankAccountsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createBankAccount: builder.mutation({
            query: (bankAccountInfo) => ({
                url: backend.bankAccounts.createAccountUrl,
                method: 'POST',
                body: bankAccountInfo, // Just pass the bankAccountRequestInfo object directly
            }),
            invalidatesTags: [{type: 'BankAccount', id: 'LIST'}],
        }),

        getAllBankAccounts: builder.query({
            query: () => ({
                url: backend.bankAccounts.getAllUrl,
                method: 'GET',
            }),
            transformResponse: (responseData) => {
                let bankAccounts = responseData?.data?.bankAccounts || [];
                console.log("Bank accounts are : ", bankAccounts)
                return bankAccountsAdapter.setAll(initialState, bankAccounts);
            },
            providesTags: (result) =>
                result
                    ? [
                        {type: 'BankAccount', id: 'LIST'},
                        ...result.ids.map((id) => ({type: 'BankAccount', id})),
                    ]
                    : [{type: 'BankAccount', id: 'LIST'}],
        }),
        getBankAccountsByClientId: builder.query({
            query: (clientId) => {
                if (!Number(clientId) || clientId < 1) {
                    return {error: {status: 400, message: 'Invalid client ID'}};
                }
                return ({
                url: `${backend.bankAccounts.getAllByClientIdUrl }?clientId=${clientId}`,
                method: 'GET',
            })
            },
            transformResponse: (responseData) => {
                let bankAccounts = responseData?.data?.bankAccounts || [];
                return bankAccountsAdapter.setAll(initialState, bankAccounts);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        { type: 'BankAccount', id: arg },
                        ...result.ids.map((id) => ({ type: 'BankAccount', id })),
                    ]
                    : [{ type: 'BankAccount', id: arg }],
        }),

        getBankAccountByBankAccountId: builder.query({
            query: (bankAccountId) => {
                if (!Number(bankAccountId) || bankAccountId < 1) {
                    return {error: {status: 400, message: 'Invalid bank account ID'}};
                }
                return ({
                url: `${backend.bankAccounts.getByIdUrl}?bankAccountId=${bankAccountId}`,
                method: 'GET',
            })
            },
            transformResponse: (responseData) => {
                let bankAccountArray = responseData?.data?.bankAccount || [];
                bankAccountArray = bankAccountArray.map(bankAccount => {
                    const timestamp = bankAccount.requestDate;
                    let jsDate = new Date(timestamp);
                    return {
                        ...bankAccount,
                        requestDate: jsDate.toISOString(),
                    };
                });
                return bankAccountsAdapter.setAll(initialState, bankAccountArray);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        { type: 'BankAccount', id: arg },
                        ...result.ids.map((id) => ({ type: 'BankAccount', id })),
                    ]
                    : [{ type: 'BankAccount', id: arg }],
        }),
        
        deleteBankAccount: builder.mutation({
            query: bankAccount => ({
                url: `${backend.bankAccounts.deleteUrl}/${bankAccount.bankAccountId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'BankAccount', id: arg.bankAccountId },
                { type: 'BankAccount', id: 'LIST' },
            ],
        }),

    }),
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------

export const {
    useCreateBankAccountMutation,
    useGetAllBankAccountsQuery,
    useGetBankAccountsByClientIdQuery,
    useGetBankAccountByBankAccountIdQuery,
    useDeleteBankAccountMutation,
} = bankAccountsApiSlice

//----------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------

export const selectAllBankAccountsResult = bankAccountsApiSlice.endpoints.getAllBankAccounts.select()
export const selectBankAccountsByClientIdResult = (clientId) => bankAccountsApiSlice.endpoints.getBankAccountsForClient.select(clientId)
export const selectBankAccountByBankAccountIdResult = (bankAccountId) => bankAccountsApiSlice.endpoints.getBankAccountByBankAccountId(bankAccountId)

//----------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------

export const selectAllBankAccountsData = createSelector(
    selectAllBankAccountsResult,
    (allBankAccountsResult) => allBankAccountsResult.data
)

export const selectBankAccountsByClientIdData = (clientId) => createSelector(
    selectBankAccountsByClientIdResult(clientId),
    (bankAccountsByClientIdResult) => bankAccountsByClientIdResult.data
)

export const selectBankAccountByBankAccountIdData = (bankAccountId) => createSelector(
    selectBankAccountByBankAccountIdResult(bankAccountId),
    (bankAccountByBankAccountIdResult) => bankAccountByBankAccountIdResult.data
)

//----------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------

export const {
    selectAll: selectAllBankAccounts,
    selectById: selectBankAccountById,
    selectIds: selectAllBankAccountIds,
} = bankAccountsAdapter.getSelectors((state) => selectAllBankAccountsData(state) ?? initialState);

export const {
    selectAll: selectAllIndividualBankAccounts,
    selectById: selectIndividualBankAccountById,
    selectIds: selectAllIndividualBankAccountIds,
} = bankAccountsAdapter.getSelectors((state, clientId) => selectBankAccountsByClientIdData(clientId)(state) ?? initialState);

export const {
    selectAll: selectSingleLoanArray
} = bankAccountsAdapter.getSelectors((state, bankAccountId) => selectBankAccountByBankAccountIdData(bankAccountId)(state) ?? initialState);
//----------------------------------------------------------------------------------------------------------------