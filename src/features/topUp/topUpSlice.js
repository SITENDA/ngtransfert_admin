import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const isValidNumber = (number) => Number(number) && number >= 1
const isValidString = (str) => (str && typeof str === 'string' && str.trim().length >= 0)

export const topUpApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        doCurrencyExchange: builder.mutation({
            query: ({
                        sourceCurrencyCode,
                        targetCurrencyCode,
                        sourceAmount,
                        targetAmount,
                        countryId,
                        directionOfExchange
                    }) => {
                // Check for invalid inputs
                if (!isValidNumber(countryId)) {
                    return {error: {status: 400, message: 'Invalid country ID'}};
                } else if (!isValidNumber(sourceAmount) && !isValidNumber(targetAmount)) {
                    return {error: {status: 400, message: 'Invalid source and target amount'}};
                } else if (!isValidString(sourceCurrencyCode)) {
                    return {error: {status: 400, message: 'Invalid source currency code'}};
                } else if (!isValidString(targetCurrencyCode)) {
                    return {error: {status: 400, message: 'Invalid target currency code'}};
                } else if (!isValidString(directionOfExchange)) {
                    return {error: {status: 400, message: 'Invalid direction of exchange'}};
                }

                // Create FormData object
                const formData = new FormData();
                formData.append('sourceCurrencyCode', sourceCurrencyCode);
                formData.append('targetCurrencyCode', targetCurrencyCode);
                formData.append('sourceAmount', sourceAmount ? sourceAmount : 0);
                formData.append('targetAmount', targetAmount ? targetAmount : 0);
                formData.append('countryId', countryId);
                formData.append('directionOfExchange', directionOfExchange);

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
                        {type: 'Exchange', id: arg},
                        ...result.ids.map((id) => ({type: 'Exchange', id})),
                    ]
                    : [{type: 'Exchange', id: arg}],
        }),

        getRateForCurrencyAndCountry: builder.query({
            query: (countryName) => {
                if (!isValidString(countryName)) {
                    return {error: {status: 400, message: 'Invalid target country name'}};
                }
                return ({
                    url: `${backend.exchanges.getRateForCurrencyAndCountryUrl}?countryName=${countryName}`,
                    method: 'GET',
                })
            },
            transformResponse: (responseData) => {
                return responseData?.data || null;
            }
        }),

        getAmountInCNY: builder.mutation({
            query: ({countryName, amountInOtherCurrency}) => {
                if (!isValidString(countryName)) {
                    return {error: {status: 400, message: 'Invalid country name'}};
                }
                if (!isValidNumber(amountInOtherCurrency)) {
                    return {error: {status: 400, message: 'Invalid amount in other currency'}};
                }

                // Create FormData object
                const formData = new FormData();
                formData.append('countryName', countryName);
                formData.append('amountInOtherCurrency', amountInOtherCurrency);

                // Return the request as a POST request
                return {
                    url: backend.exchanges.getAmountInCNYUrl,
                    method: 'POST',
                    body: formData,  // Submit FormData
                };
            },

            transformResponse: (responseData) => {
                return responseData?.data || null;
            },
        }),

        getAmountInOtherCurrency: builder.mutation({
            query: ({countryName, amountInCNY}) => {
                if (!isValidString(countryName)) {
                    return {error: {status: 400, message: 'Invalid country name'}};
                }
                if (!isValidNumber(amountInCNY)) {
                    return {error: {status: 400, message: 'Invalid amount in CNY'}};
                }

                // Create FormData object
                const formData = new FormData();
                formData.append('countryName', countryName);
                formData.append('amountInCNY', amountInCNY);

                // Return the request as a POST request
                return {
                    url: backend.exchanges.getAmountInOtherCurrencyUrl,
                    method: 'POST',
                    body: formData,  // Submit FormData
                };
            },

            transformResponse: (responseData) => {
                return responseData?.data || null;
            },
        }),


        topUpAccountBalance: builder.mutation({
            query: (topUpData) => {
                return {
                    url: backend.exchanges.topUpAccountBalanceUrl,
                    method: 'POST',
                    body: topUpData,
                };
            },
            transformResponse: (responseData) => {
                return responseData || {};
            },
        }),

        getAllAdminPercentages: builder.query({
            query: () => ({
                url: backend.adminPercentages.getAllAdminPercentagesUrl,
                method: 'GET',
            }),
            transformResponse: (responseData) => {
                return responseData?.data?.adminPercentages || [];
            }
        }),
        getAllExchangeRates: builder.query({
            query: () => ({
                url: backend.exchanges.getAllUrl,
                method: 'GET',
            }),
            transformResponse: (responseData) => {
                return responseData?.data?.exchangeRates || [];
            }
        }),

        getExchangeRatesBySourceCurrencyCNY: builder.query({
            query: () => ({
                url: backend.exchanges.findAllBySourceCurrencyCNYUrl,
                method: 'GET',
            }),
            transformResponse: (responseData) => {
                return responseData?.data?.exchangeRates || [];
            }
        }),

    }),
});

export const {
    useDoCurrencyExchangeMutation,
    useTopUpAccountBalanceMutation,
    useGetRateForCurrencyAndCountryQuery,
    useGetAmountInCNYMutation,
    useGetAmountInOtherCurrencyMutation,
    useGetAllAdminPercentagesQuery,
    useGetAllExchangeRatesQuery,
    useGetExchangeRatesBySourceCurrencyCNYQuery,
} = topUpApiSlice;