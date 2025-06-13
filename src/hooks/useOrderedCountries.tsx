// src/hooks/useOrderedCountries.ts
"use client"; // This hook needs to be a client-side module to use useTranslations and React hooks

import {useMemo} from "react";
// import {useTranslations} from 'next-intl';
import {Country} from "../../types/country";
import {DataObj} from "../../types/DataObj";
import CountryFlag from "@/components/CountryFlag";
import {undefined} from "zod";

/**
 * A custom hook to transform an array of Country objects into the DataObj format
 * suitable for the SelectWithLabel component.
 * The label will be the country's name, and the icon will be its flag.
 *
 * @param {Country[]} countries - An array of Country objects to process.
 * @returns {DataObj[]} An array of DataObj, formatted for use in SelectWithLabel.
 */
export const useOrderedCountries = (countries: Country[]): DataObj[] => {
    // You can use useTranslations here if you plan to translate country names later.
    // For now, we'll use the raw countryName.
    // const t = useTranslations('CountrySelector'); // Example namespace, adjust as needed

    // Use useMemo to optimize performance by only re-calculating options
    // when the 'countries' array reference changes.
     // Re-run memoization if countries array or translation function changes
    return useMemo(() => {
        if (!countries || countries.length === 0) {
            return [];
        }

        return countries.map(country => ({
            label: <div className="flex items-center"> {/* Use flexbox to align items */}
                <span>{country.countryName}</span> {/* Country name */}
                {country.countryFlagUrl && country.countryName !== "Other countries" ? (
                    <CountryFlag
                        flagUrl={country.countryFlagUrl}
                        alt={country.countryName}
                        style={{ width: '20px', height: '15px', marginLeft: '8px' }} // Add margin for spacing
                    />
                ) : null} {/* Render nothing if no flag or "Other countries" */}
            </div>,
            value: String(country.countryId), // Ensure value is a string, as required by DataObj
            icon: undefined
        }));
    }, [countries]);
};
