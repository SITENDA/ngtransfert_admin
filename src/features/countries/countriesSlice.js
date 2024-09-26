import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const countriesAdapter = createEntityAdapter({
    selectId: (country) => country.countryId,
    sortComparer: (a, b) => b.countryId - a.countryId
});

const initialState = countriesAdapter.getInitialState()

export const countriesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllCountries: builder.query({
            query: () => backend.countries.getAllUrl,
            transformResponse: responseData => {
                if (responseData?.data?.countries) {
                    const countries = responseData?.data?.countries || []
                    return countriesAdapter.setAll(initialState, countries)
                }
            },
            providesTags: (result, error, arg) => [
                {type: 'Country', id: "LIST"}
            ]
        }),
    })
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------
export const {
    useGetAllCountriesQuery
} = countriesApiSlice
//------------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------
export const selectAllCountriesResult = countriesApiSlice.endpoints.getAllCountries.select()
//------------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------
export const selectAllCountriesData = createSelector(
    selectAllCountriesResult,
    allCountriesResult => allCountriesResult.data
)
//------------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------
export const {
    selectAll: selectAllCountries,
    selectIds: selectAllCountryIds,
    selectById: selectCountryById,
 } = countriesAdapter.getSelectors((state) => selectAllCountriesData(state) ?? initialState)

//----------------------------------------------------------------------------------------------------------------

export default countriesApiSlice.reducer