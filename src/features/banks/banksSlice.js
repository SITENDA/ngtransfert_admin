import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const banksAdapter = createEntityAdapter({
    selectId: (bank) => bank.bankId,
    sortComparer: (a, b) => b.bankId - a.bankId
});

const initialState = banksAdapter.getInitialState()

export const banksApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllBanks: builder.query({
            query: () => backend.banks.getAllUrl,
            transformResponse: responseData => {
                if (responseData?.data?.banks) {
                    const banks = responseData?.data?.banks
                    return banksAdapter.setAll(initialState, banks)
                }
            },
            providesTags: (result, error, arg) => [
                {type: 'Bank', id: "LIST"},
                ...result.ids.map(id => ({type: 'Bank', id}))
            ]
        }),
        getAllBanksInCountry: builder.query({
            query: (countryId) => countryId? `${backend.banks.getAllByCountryUrl}?countryId=${countryId}` : [],
            transformResponse: responseData => {
                if (responseData?.data?.banks) {
                    const banks = responseData?.data?.banks
                    return banksAdapter.setAll(initialState, banks)
                }
            },
            providesTags: (result, error, arg) => [
                {type: 'Bank', id: "LIST"},
                ...result.ids.map(id => ({type: 'Bank', id}))
            ]
        }),
        getBankById: builder.query({
            query: (bankId) => bankId? `${backend.banks.getByIdUrl}?bankId=${bankId}` : null,
            transformResponse: responseData => {
                if (responseData?.data?.bank) {
                    return responseData?.data?.bank
                }
                return null
            },
            providesTags: (result, error, arg) => [
                {type: 'Bank', id: arg},
            ]
        }),
    })
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------
export const {
    useGetAllBanksQuery,
    useGetAllBanksInCountryQuery,
    useGetBankByIdQuery,
} = banksApiSlice
//------------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------
export const selectAllBanksResult = banksApiSlice.endpoints.getAllBanks.select()
export const selectAllBanksInCountryResult = (countryId) => banksApiSlice.endpoints.getAllBanksInCountry.select(countryId);
export const selectBankById = (bankId) => banksApiSlice.endpoints.getBankById.select(bankId);
//------------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------
export const selectAllBanksData = createSelector(
    selectAllBanksResult,
    allBanksResult => allBanksResult.data
)
export const selectAllBanksInCountryData = (countryId) => createSelector(
    selectAllBanksInCountryResult(countryId),
    allBanksInCountryResult => allBanksInCountryResult.data
)
//------------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------
export const { selectAll: selectAllBanks } = banksAdapter.getSelectors((state) => selectAllBanksData(state) ?? initialState)

export const {
    selectAll: selectAllBanksInCountry,
    selectIds: selectAllBankIdsInCountry,
    selectById: selectBankInCountryById,
 } = banksAdapter.getSelectors((state, countryId) => selectAllBanksInCountryData(countryId)(state) ?? initialState)
//----------------------------------------------------------------------------------------------------------------
export default banksApiSlice.reducer