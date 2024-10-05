import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

export const topUpApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // doCurrencyExchange: builder.query({
        //     query: (sourceCurrencyCode, targetCurrencyCode, sourceAmount, countryId) => {
        //         if (!Number(countryId) || countryId < 1) {
        //             console.log("Country id : ", countryId);
        //             return {error: {status: 400, message: 'Invalid country ID'}};
        //         } else if (!Number(sourceAmount) || sourceAmount < 1) {
        //             console.log("source amount : ", sourceAmount);
        //             return {error: {status: 400, message: 'Invalid source amount'}};
        //         } else if (!sourceCurrencyCode || typeof sourceCurrencyCode !== 'string' || sourceCurrencyCode.trim().length === 0) {
        //             console.log("source currency code : ", sourceCurrencyCode);
        //             return {error: {status: 400, message: 'Invalid source currency code'}};
        //         } else if (!targetCurrencyCode || typeof targetCurrencyCode !== 'string' || targetCurrencyCode.trim().length === 0) {
        //             console.log("target currency code : ", targetCurrencyCode);
        //             return {error: {status: 400, message: 'Invalid target currency code'}};
        //         }
        //         // Correctly format the query parameters using '&'
        //         return {
        //             url: `${backend.exchanges.doCurrencyExchangeUrl}?sourceCurrencyCode=${sourceCurrencyCode}&targetCurrencyCode=${targetCurrencyCode}&sourceAmount=${sourceAmount}&countryId=${countryId}`,
        //             method: 'GET',
        //         };
        //     },
        //
        //     transformResponse: (responseData) => {
        //         return responseData?.data || {};
        //     },
        //     providesTags: (result, error, arg) =>
        //         result
        //             ? [
        //                 {type: 'BankAccount', id: arg},
        //                 ...result.ids.map((id) => ({type: 'BankAccount', id})),
        //             ]
        //             : [{type: 'BankAccount', id: arg}],
        // }),
        doCurrencyExchange: builder.mutation({
            query: ({sourceCurrencyCode, targetCurrencyCode, sourceAmount, countryId}) => {
                // Check for invalid inputs
                if (!Number(countryId) || countryId < 1) {
                    console.log("Country id : ", countryId);
                    return {error: {status: 400, message: 'Invalid country ID'}};
                } else if (!Number(sourceAmount) || sourceAmount < 1) {
                    console.log("source amount : ", sourceAmount);
                    return {error: {status: 400, message: 'Invalid source amount'}};
                } else if (!sourceCurrencyCode || typeof sourceCurrencyCode !== 'string' || sourceCurrencyCode.trim().length === 0) {
                    console.log("source currency code : ", sourceCurrencyCode);
                    return {error: {status: 400, message: 'Invalid source currency code'}};
                } else if (!targetCurrencyCode || typeof targetCurrencyCode !== 'string' || targetCurrencyCode.trim().length === 0) {
                    console.log("target currency code : ", targetCurrencyCode);
                    return {error: {status: 400, message: 'Invalid target currency code'}};
                }

                // Create FormData object
                const formData = new FormData();
                formData.append('sourceCurrencyCode', sourceCurrencyCode);
                formData.append('targetCurrencyCode', targetCurrencyCode);
                formData.append('sourceAmount', sourceAmount);
                formData.append('countryId', countryId);

                // Return the request as a POST request
                return {
                    url: backend.exchanges.doCurrencyExchangeUrl,
                    method: 'POST',
                    body: formData,  // Submit FormData
                };
            },

            transformResponse: (responseData) => {
                return responseData?.data || {};
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        {type: 'BankAccount', id: arg},
                        ...result.ids.map((id) => ({type: 'BankAccount', id})),
                    ]
                    : [{type: 'BankAccount', id: arg}],
        }),

    }),
});

export const {
    useDoCurrencyExchangeMutation,
} = topUpApiSlice;