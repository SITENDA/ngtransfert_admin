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
        getPriorityCountries: builder.query({
            query: () => backend.countries.getPriorityCountriesUrl,
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
        getCountryByCountryId: builder.query({
            queryFn: (countryId, queryApi, extraOptions, baseQuery) => {
                // Check if countryId is 0 or not a number
                if (countryId === 0 || isNaN(countryId)) {
                    // Return an empty result or handle this as an error if needed
                    return {error: {status: 400, message: 'Invalid country ID'}};
                }
                // Proceed with sending the request if countryId is valid
                return baseQuery({
                    url: `${backend.countries.getByIdUrl}?countryId=${countryId}`,
                    method: 'GET',
                });
            },
            transformResponse: (responseData) => {
                return responseData?.data?.country || {};
            },
            providesTags: (result, error, arg) => [{type: 'Country', id: arg}],
        }),
        getCountryByCountryName: builder.query({
            queryFn: (countryName, queryApi, extraOptions, baseQuery) => {
                // Check if countryName is a valid non-empty string
                if (!countryName || typeof countryName !== 'string' || countryName.trim().length === 0) {
                    // Return an error if countryName is not valid
                    return {error: {status: 400, message: 'Invalid country name'}};
                }
                // Proceed with sending the request if countryName is valid
                return baseQuery({
                    url: `${backend.countries.getByCountryNameUrl}?countryName=${countryName}`,
                    method: 'GET',
                });
            },
            transformResponse: (responseData) => {
                return responseData?.data?.country || {};
            },
            providesTags: (result, error, arg) => [{type: 'Country', id: arg}],
        }),


    })
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------
export const {
    useGetAllCountriesQuery,
    useGetPriorityCountriesQuery,
    useGetCountryByCountryIdQuery,
    useGetCountryByCountryNameQuery,
} = countriesApiSlice
//------------------------------------------------------------------------------------------------------------------

//---- returning the query result objects-------------------------------------------------------------------------
export const selectAllCountriesResult = countriesApiSlice.endpoints.getAllCountries.select()
export const selectPriorityCountriesResult = countriesApiSlice.endpoints.getPriorityCountries.select()
//------------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------
export const selectAllCountriesData = createSelector(
    selectAllCountriesResult,
    allCountriesResult => allCountriesResult.data
)

export const selectPriorityCountriesData = createSelector(
    selectPriorityCountriesResult,
    priorityCountriesResult => priorityCountriesResult.data
)
//------------------------------------------------------------------------------------------------------------------

//----  Exporting selectors for data returned by the different endpoints ---------------------------------------
export const {selectAll: selectAllCountries} = countriesAdapter.getSelectors((state) => selectAllCountriesData(state) ?? initialState)
export const {selectAll: selectPriorityCountries} = countriesAdapter.getSelectors((state) => selectPriorityCountriesData(state) ?? initialState)

//----------------------------------------------------------------------------------------------------------------

export default countriesApiSlice.reducer