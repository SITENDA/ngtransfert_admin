import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const cashDepositAddressesAdapter = createEntityAdapter({
    selectId: (cashDepositAddress) => cashDepositAddress.cashDepositAddressId,
    sortComparer: (a, b) => b.cashDepositAddressId - a.cashDepositAddressId,
});

const initialState = cashDepositAddressesAdapter.getInitialState();

export const cashDepositAddressesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createCashDepositAddress: builder.mutation({
            query: (cashDepositAddressInfo) => ({
                url: backend.cashDepositAddresses.createCashDepositAddressUrl,
                method: 'POST',
                body: cashDepositAddressInfo,
            }),
            invalidatesTags: [{type: 'CashDepositAddress', id: 'LIST'}],
        }),
        getCashDepositAddressesByCountryId: builder.query({
            query: (countryId) => {
                if (!Number(countryId) || countryId < 1) {
                    return {error: {status: 400, message: 'Invalid country ID'}};
                }
                return ({
                    url: `${backend.cashDepositAddresses.getCashDepositAddressesByCountryIdUrl}?countryId=${countryId}`,
                    method: 'GET',
                })
            },
            transformResponse: (responseData) => {
                let cashDepositAddresses = responseData?.data?.cashDepositAddresses || [];
                return cashDepositAddressesAdapter.setAll(initialState, cashDepositAddresses);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        {type: 'CashDepositAddress', id: arg},
                        ...result.ids.map((id) => ({type: 'CashDepositAddress', id})),
                    ]
                    : [{type: 'CashDepositAddress', id: arg}],
        }),
        getCashDepositAddressesByCountryName: builder.query({
            query: (countryName) => {
                if (!countryName || typeof countryName !== 'string' || countryName.trim().length === 0) {
                    return {error: {status: 400, message: 'Invalid country name'}};
                }
                return ({
                    url: `${backend.cashDepositAddresses.getCashDepositAddressesByCountryNameUrl}?countryName=${countryName}`,
                    method: 'GET',
                })
            },
            transformResponse: (responseData) => {
                let cashDepositAddresses = responseData?.data?.cashDepositAddresses || [];
                return cashDepositAddressesAdapter.setAll(initialState, cashDepositAddresses);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        {type: 'CashDepositAddress', id: arg},
                        ...result.ids.map((id) => ({type: 'CashDepositAddress', id})),
                    ]
                    : [{type: 'CashDepositAddress', id: arg}],
        }),

        deleteCashDepositAddress: builder.mutation({
            query: cashDepositAddress => ({
                url: `${backend.cashDepositAddresses.deleteUrl}/${cashDepositAddress.cashDepositAddressId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'CashDepositAddress', id: arg.cashDepositAddressId},
                {type: 'CashDepositAddress', id: 'LIST'},
            ],
        }),

    }),
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------

export const {
    useCreateCashDepositAddressMutation,
    useGetCashDepositAddressesByCountryIdQuery,
    useGetCashDepositAddressesByCountryNameQuery,
    useDeleteCashDepositAddressMutation,
} = cashDepositAddressesApiSlice

//----------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------

export const selectCashDepositAddressesByCountryIdResult = (countryId) => cashDepositAddressesApiSlice.endpoints.getCashDepositAddressesByCountryId.select(countryId)
export const selectCashDepositAddressesByCountryNameResult = (countryName) => cashDepositAddressesApiSlice.endpoints.getCashDepositAddressesByCountryName.select(countryName)

//----------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------

export const selectCashDepositAddressesByCountryIdData = (countryId) => createSelector(
    selectCashDepositAddressesByCountryIdResult(countryId),
    (cashDepositAddressesByCountryIdResult) => cashDepositAddressesByCountryIdResult.data
)

export const selectCashDepositAddressesByCountryNameData = (countryName) => createSelector(
    selectCashDepositAddressesByCountryNameResult(countryName),
    (cashDepositAddressesByCountryNameResult) => cashDepositAddressesByCountryNameResult.data
)

//----------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------

export const {selectAll: selectCashDepositAddressesByCountryId} = cashDepositAddressesAdapter.getSelectors((state, countryId) => selectCashDepositAddressesByCountryIdData(countryId)(state) ?? initialState);
export const {selectAll: selectCashDepositAddressesByCountryName} = cashDepositAddressesAdapter.getSelectors((state, countryName) => selectCashDepositAddressesByCountryNameData(countryName)(state) ?? initialState);

//----------------------------------------------------------------------------------------------------------------