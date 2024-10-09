import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const isValidNumber = (number) => Number(number) && number >= 1
    const isValidString = (str) => (str && typeof str === 'string' && str.trim().length >= 0)

export const topUpApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        doCurrencyExchange: builder.mutation({
            query: ({sourceCurrencyCode, targetCurrencyCode, sourceAmount, targetAmount, countryId, directionOfExchange}) => {
                // Check for invalid inputs
                if (!isValidNumber(countryId)) {
                    return {error: {status: 400, message: 'Invalid country ID'}};
                }
                else if (!isValidNumber(sourceAmount) && !isValidNumber(targetAmount)) {
                    return {error: {status: 400, message: 'Invalid source and target amount'}};
                }
                else if (!isValidString(sourceCurrencyCode)){
                    return {error: {status: 400, message: 'Invalid source currency code'}};
                } else if (!isValidString(targetCurrencyCode)) {
                    return {error: {status: 400, message: 'Invalid target currency code'}};
                }
                else if (!isValidString(directionOfExchange)) {
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
                        {type: 'BankAccount', id: arg},
                        ...result.ids.map((id) => ({type: 'BankAccount', id})),
                    ]
                    : [{type: 'BankAccount', id: arg}],
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

    }),
});

export const {
    useDoCurrencyExchangeMutation,
    useTopUpAccountBalanceMutation,
} = topUpApiSlice;