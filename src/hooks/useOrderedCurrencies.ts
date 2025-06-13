// src/hooks/useOrderedCurrencies.ts
"use client"; // This hook needs to be a client-side module to use useTranslations and React hooks

import {useMemo} from "react";
// import { useTranslations } from 'next-intl';
import {DataObj} from "../../types/DataObj"; // Assuming your DataObj interface is defined here
import {Country} from "../../types/country"; // Assuming your Country interface is defined here
import {Currency} from "../../types/currency"; // Import the new Currency interface


/**
 * A custom hook to transform an array of Currency objects into the DataObj format
 * suitable for the SelectWithLabel component.
 * It prioritizes a specific currency (e.g., the currency of a selected country)
 * to appear at the top of the list.
 *
 * @param {Currency[]} currencies - An array of Currency objects to process.
 * @param {Country | null | undefined} country - An optional Country object whose currency should be prioritized.
 * @returns {DataObj[]} An array of DataObj, formatted for use in SelectWithLabel.
 */
export const useOrderedCurrencies = (
    currencies: Currency[],
    country?: Country | null // Make country optional and possibly null
): DataObj[] => {
    // You can use useTranslations here if you plan to translate currency names later.
    // For now, we'll use the currencyCode and currencySymbol for labels.
    // const t = useTranslations('CurrencySelector'); // Example namespace, adjust as needed


     // Re-run memoization if currencies, country, or translation function changes
    return useMemo(() => {
        if (!currencies || currencies.length === 0) {
            return [];
        }

        const prioritizedCurrencyId = country?.currency?.currencyId;
        let prioritizedCurrency: Currency | undefined;
        let otherCurrencies: Currency[] = [];

        if (prioritizedCurrencyId) {
            // Find the currency to prioritize
            prioritizedCurrency = currencies.find(c => c.currencyId === prioritizedCurrencyId);
            // Filter out the prioritized currency from the rest
            otherCurrencies = currencies.filter(c => c.currencyId !== prioritizedCurrencyId);
        } else {
            // If no country or no specific currency to prioritize, all are "other"
            otherCurrencies = [...currencies];
        }

        // Map currencies to DataObj format
        const otherOptions: DataObj[] = otherCurrencies.map(currency => ({
            label: `${currency.currencyCode} (${currency.currencySymbol})`,
            value: String(currency.currencyId), // Ensure value is a string
            icon: undefined, // Currencies typically don't have visual icons like flags
        }));

        let priorityOption: DataObj | undefined;
        if (prioritizedCurrency) {
            priorityOption = {
                label: `${prioritizedCurrency.currencyCode} (${prioritizedCurrency.currencySymbol})`,
                value: String(prioritizedCurrency.currencyId),
                icon: undefined,
            };
            // Add a small separator or distinguishing feature for the prioritized item visually if needed,
            // though react-select doesn't directly support separators within options array.
            // This would typically be handled in a custom `formatOptionLabel`.
        }

        // Combine and return the ordered list
        return priorityOption ? [priorityOption, ...otherOptions] : otherOptions;

    }, [currencies, country]);
};
