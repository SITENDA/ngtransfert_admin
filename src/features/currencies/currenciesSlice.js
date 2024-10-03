import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const currenciesAdapter = createEntityAdapter({
    selectId: (currency) => currency.currencyId,
    sortComparer: (a, b) => b.currencyId - a.currencyId
});

const initialState = currenciesAdapter.getInitialState()

export const currenciesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllCurrencies: builder.query({
            query: () => backend.currencies.getAllUrl,
            transformResponse: responseData => {
                if (responseData?.data?.currencies) {
                    const currencies = responseData?.data?.currencies
                    return currenciesAdapter.setAll(initialState, currencies)
                }
            },
            providesTags: (result, error, arg) => [
                {type: 'Currency', id: "LIST"},
                ...result.ids.map(id => ({type: 'Currency', id}))
            ]
        }),
        getPriorityCurrencies: builder.query({
            query: () => backend.currencies.getPriorityCurrenciesUrl,
            transformResponse: responseData => {
                if (responseData?.data?.currencies) {
                    const currencies = responseData?.data?.currencies
                    return currenciesAdapter.setAll(initialState, currencies)
                }
            },
            providesTags: (result, error, arg) => [
                {type: 'Currency', id: "LIST"},
                ...result.ids.map(id => ({type: 'Currency', id}))
            ]
        }),
        getCurrenciesForCountry: builder.query({
            query: (countryId) => countryId ? `${backend.currencies.getCurrenciesForCountryUrl}?countryId=${countryId}` : [],
            transformResponse: responseData => {
                if (responseData?.data?.currencies) {
                    const currencies = responseData?.data?.currencies
                    return currenciesAdapter.setAll(initialState, currencies)
                }
            },
            providesTags: (result, error, arg) => [
                {type: 'Currency', id: "LIST"},
                ...result.ids.map(id => ({type: 'Currency', id}))
            ]
        }),

        getCurrencyById: builder.query({
            query: (currencyId) => currencyId ? `${backend.currencies.getByIdUrl}?currencyId=${currencyId}` : null,
            transformResponse: responseData => {
                if (responseData?.data?.currency) {
                    return responseData?.data?.currency
                }
                return null
            },
            providesTags: (result, error, arg) => [
                {type: 'Currency', id: arg},
            ]
        }),
    })
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------
export const {
    useGetAllCurrenciesQuery,
    useGetPriorityCurrenciesQuery,
    useGetCurrenciesForCountryQuery,
    useGetCurrencyByIdQuery,
} = currenciesApiSlice
//------------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------
export const selectAllCurrenciesResult = currenciesApiSlice.endpoints.getAllCurrencies.select()
export const selectPriorityCurrenciesResult = currenciesApiSlice.endpoints.getPriorityCurrencies.select()
export const selectCurrenciesForCountryResult = (countryId) => currenciesApiSlice.endpoints.getCurrenciesForCountry.select(countryId)
export const selectCurrencyById = (currencyId) => currenciesApiSlice.endpoints.getCurrencyById.select(currencyId);
//------------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------
export const selectAllCurrenciesData = createSelector(
    selectAllCurrenciesResult,
    allCurrenciesResult => allCurrenciesResult.data
)

export const selectPriorityCurrenciesData = createSelector(
    selectPriorityCurrenciesResult,
    priorityCurrenciesResult => priorityCurrenciesResult.data
)

export const selectCurrenciesForCountryData = (countryId) => createSelector(
    selectCurrenciesForCountryResult(countryId),
    currenciesForCountryResult => currenciesForCountryResult.data
)
//------------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------
export const {selectAll: selectAllCurrencies} = currenciesAdapter.getSelectors((state) => selectAllCurrenciesData(state) ?? initialState)
export const {selectAll: selectPriorityCurrencies} = currenciesAdapter.getSelectors((state) => selectPriorityCurrenciesData(state) ?? initialState)
export const {selectAll: selectCurrenciesForCountry} = currenciesAdapter.getSelectors((state, countryId) => selectCurrenciesForCountryData(countryId)(state) ?? initialState)
//----------------------------------------------------------------------------------------------------------------
export default currenciesApiSlice.reducer