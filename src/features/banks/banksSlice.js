import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";
import {isValidString} from "../auth/authSlice";

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
            query: (countryId) => {
                if (!Number(countryId) || countryId < 1) {
                    return {error: {status: 400, message: 'Invalid country ID'}};
                }
                return `${backend.banks.getAllByCountryUrl}?countryId=${countryId}`
            },
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
        getBanksByCountryName: builder.query({
            query: (countryName) => {
                if (!isValidString(countryName)) {
                    return {error: {status: 400, message: 'Invalid country name'}};
                }
                return `${backend.banks.getAllByCountryNameUrl}?countryName=${countryName}`
            },
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
            query: (bankId) => {
                if (!Number(bankId) || bankId < 1) {
                    return {error: {status: 400, message: 'Invalid bank ID'}};
                }
                return `${backend.banks.getByIdUrl}?bankId=${bankId}`
            },
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
    useGetBanksByCountryNameQuery,
    useGetBankByIdQuery,
} = banksApiSlice
//------------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------
export const selectAllBanksResult = banksApiSlice.endpoints.getAllBanks.select()
export const selectAllBanksInCountryResult = (countryId) => banksApiSlice.endpoints.getAllBanksInCountry.select(countryId);
export const selectBanksByCountryNameResult = (countryName) => banksApiSlice.endpoints.getBanksByCountryName.select(countryName);
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

export const selectBanksByCountryNameData = (countryName) => createSelector(
    selectBanksByCountryNameResult(countryName),
    banksByCountryNameResult => banksByCountryNameResult.data
)
//------------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------
export const { selectAll: selectAllBanks } = banksAdapter.getSelectors((state) => selectAllBanksData(state) ?? initialState)

export const {
    selectAll: selectAllBanksInCountry,
    selectIds: selectAllBankIdsInCountry,
    selectById: selectBankInCountryById,
 } = banksAdapter.getSelectors((state, countryId) => selectAllBanksInCountryData(countryId)(state) ?? initialState)

export const {
    selectAll: selectBanksByCountryName,
    selectIds: selectAllBankIdsByCountryName,
    selectById: selectBankByCountryNameById,
 } = banksAdapter.getSelectors((state, countryName) => selectBanksByCountryNameData(countryName)(state) ?? initialState)
//----------------------------------------------------------------------------------------------------------------
export default banksApiSlice.reducer