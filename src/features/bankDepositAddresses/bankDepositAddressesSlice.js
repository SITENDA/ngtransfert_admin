import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const bankDepositAddressesAdapter = createEntityAdapter({
    selectId: (bankDepositAddress) => bankDepositAddress.bankDepositAddressId,
    sortComparer: (a, b) => b.bankDepositAddressId - a.bankDepositAddressId,
});

const initialState = bankDepositAddressesAdapter.getInitialState();

export const bankDepositAddressesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createBankDepositAddress: builder.mutation({
            query: (bankDepositAddressInfo) => ({
                url: backend.bankDepositAddresses.createBankDepositAddressUrl,
                method: 'POST',
                body: bankDepositAddressInfo,
            }),
            invalidatesTags: [{type: 'BankDepositAddress', id: 'LIST'}],
        }),
        getBankDepositAddressesByCountryId: builder.query({
            query: (countryId) => {
                if (!Number(countryId) || countryId < 1) {
                    return {error: {status: 400, message: 'Invalid country ID'}};
                }
                return ({
                    url: `${backend.bankDepositAddresses.getBankDepositAddressesByCountryIdUrl}?countryId=${countryId}`,
                    method: 'GET',
                })
            },
            transformResponse: (responseData) => {
                let bankDepositAddresses = responseData?.data?.bankDepositAddresses || [];
                return bankDepositAddressesAdapter.setAll(initialState, bankDepositAddresses);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        {type: 'BankDepositAddress', id: arg},
                        ...result.ids.map((id) => ({type: 'BankDepositAddress', id})),
                    ]
                    : [{type: 'BankDepositAddress', id: arg}],
        }),
        getBankDepositAddressesByCountryName: builder.query({
            query: (countryName) => {
                if (!countryName || typeof countryName !== 'string' || countryName.trim().length === 0) {
                    return {error: {status: 400, message: 'Invalid country name'}};
                }
                return ({
                    url: `${backend.bankDepositAddresses.getBankDepositAddressesByCountryNameUrl}?countryName=${countryName}`,
                    method: 'GET',
                })
            },
            transformResponse: (responseData) => {
                let bankDepositAddresses = responseData?.data?.bankDepositAddresses || [];
                return bankDepositAddressesAdapter.setAll(initialState, bankDepositAddresses);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        {type: 'BankDepositAddress', id: arg},
                        ...result.ids.map((id) => ({type: 'BankDepositAddress', id})),
                    ]
                    : [{type: 'BankDepositAddress', id: arg}],
        }),

        deleteBankDepositAddress: builder.mutation({
            query: bankDepositAddress => ({
                url: `${backend.bankDepositAddresses.deleteUrl}/${bankDepositAddress.bankDepositAddressId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'BankDepositAddress', id: arg.bankDepositAddressId},
                {type: 'BankDepositAddress', id: 'LIST'},
            ],
        }),

    }),
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------

export const {
    useCreateBankDepositAddressMutation,
    useGetBankDepositAddressesByCountryIdQuery,
    useGetBankDepositAddressesByCountryNameQuery,
    useDeleteBankDepositAddressMutation,
} = bankDepositAddressesApiSlice

//----------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------

export const selectBankDepositAddressesByCountryIdResult = (countryId) => bankDepositAddressesApiSlice.endpoints.getBankDepositAddressesByCountryId.select(countryId)
export const selectBankDepositAddressesByCountryNameResult = (countryName) => bankDepositAddressesApiSlice.endpoints.getBankDepositAddressesByCountryName.select(countryName)

//----------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------

export const selectBankDepositAddressesByCountryIdData = (countryId) => createSelector(
    selectBankDepositAddressesByCountryIdResult(countryId),
    (bankDepositAddressesByCountryIdResult) => bankDepositAddressesByCountryIdResult.data
)

export const selectBankDepositAddressesByCountryNameData = (countryName) => createSelector(
    selectBankDepositAddressesByCountryNameResult(countryName),
    (bankDepositAddressesByCountryNameResult) => bankDepositAddressesByCountryNameResult.data
)

//----------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------

export const {selectAll: selectBankDepositAddressesByCountryId} = bankDepositAddressesAdapter.getSelectors((state, countryId) => selectBankDepositAddressesByCountryIdData(countryId)(state) ?? initialState);
export const {selectAll: selectBankDepositAddressesByCountryName} = bankDepositAddressesAdapter.getSelectors((state, countryName) => selectBankDepositAddressesByCountryNameData(countryName)(state) ?? initialState);

//----------------------------------------------------------------------------------------------------------------