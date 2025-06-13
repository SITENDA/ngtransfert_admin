// src/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/apply-for-transfer/page.tsx
// This is a Server Component.

import React from 'react';
import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import getSession from "@/lib/getSession"; // Assuming getSession is available
import { kaasitomaPaths } from "@/util/frontend-paths"; // Assuming kaasitomaPaths is available
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components

import ApplyForTransferForm from "@/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/apply-for-transfer/ApplyForTransferForm";
import { fetchBackendData } from "@/lib/backend-api-client"; // Import the new reusable fetch utility
import { Country, CountryDataPayload } from "../../../../../../../types/country";
import {Currency, CurrencyDataPayload} from "../../../../../../../types/currency";


async function ApplyForTransferPage() {
    const t = await getTranslations('ApplyForTransferPage');
    const locale = await getLocale();

    const session = await getSession();
    const clientId = session?.user?.userId;

    if (!clientId) {
        console.warn(`ApplyForTransferPage: Client ID not found after initial session check. Redirecting to /${locale}/${kaasitomaPaths.loginPath}`);
        redirect(`/${locale}/${kaasitomaPaths.loginPath}`);
    }

    let countries: Country[] = [];
    let currencies: Currency[] = []; // Initialize currencies array

    try {
        // Fetch countries
        const countryPayload = await fetchBackendData<CountryDataPayload>(
            '/kaasitoma/countries/getPriorityCountries',
            'GET',
            undefined,
            3600
        );

        if (countryPayload && countryPayload.countries) {
            countries = countryPayload.countries;
            console.log(`ApplyForTransferPage: Successfully fetched ${countries.length} countries.`);
        } else {
            console.warn("ApplyForTransferPage: No country data fetched or data structure unexpected from backend.");
        }

        // Fetch Currencies
        const currencyPayload = await fetchBackendData<CurrencyDataPayload>(
            '/kaasitoma/currencies/getPriorityCurrencies', // Use the provided backend endpoint
            'GET',
            undefined,
            3600 // Revalidate every hour
        );

        if (currencyPayload && currencyPayload.currencies) {
            currencies = currencyPayload.currencies;
            console.log(`ApplyForTransferPage: Successfully fetched ${currencies.length} currencies.`);
        } else {
            console.warn("ApplyForTransferPage: No currency data fetched or data structure unexpected from backend.");
        }

    } catch (error) {
        console.error("ApplyForTransferPage: Error during data fetching process (countries or currencies):", error);
        countries = []; // Ensure countries is an empty array on error
        currencies = []; // Ensure currencies is an empty array on error
    }

    return (
        // The outer div sets the background, blur, and border.
        <>
            <div className="
                w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]
            ">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                    {t('pageTitle')}
                </h2>

                {/* CardContent to contain the form */}
                <CardContent className="flex-grow p-6 space-y-8">
                    {/* Pass the fetched countries and currencies data, and the guaranteed clientId to the client component */}
                    <ApplyForTransferForm initialCountries={countries} initialCurrencies={currencies} clientId={clientId} />
                </CardContent>
            </div>
        </>
    );
}

export default ApplyForTransferPage;
