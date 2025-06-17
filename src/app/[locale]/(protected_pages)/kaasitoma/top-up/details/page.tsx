// src/app/[locale]/(protected_pages)/kaasitoma/details-requests/details/page.tsx
// This is a Server Component.

import React from 'react';
import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import getSession from "@/lib/getSession";
import { kaasitomaPaths } from "@/util/frontend-paths";
import { CardContent } from "@/components/ui/card";
import { fetchBackendData } from "@/lib/backend-api-client";
import { ReceiverAccountPayload, ReceiverAccount } from "../../../../../../../types/receiver-account";
import {Country, CountryDataPayload} from "../../../../../../../types/country"; // Import Country and its payload
import TopUpDetailsForm from "./TopUpDetailsForm";

interface TopUpDetailsPageProps {
    searchParams: { // Query parameters from URL
        receiverAccountId?: string;
        countryId?: string; // This is now essential for fetching the country object
        topUpMethod?: string; // Still needed for the form
    };
}

async function TopUpDetailsPage({ searchParams }: TopUpDetailsPageProps) {
    const t = await getTranslations('TopUpDetailsPage');
    const locale = await getLocale();

    const session = await getSession();
    const clientId = session?.user?.userId;

    if (!clientId) {
        console.warn(`TopUpDetailsPage: Client ID not found. Redirecting to /${locale}${kaasitomaPaths.loginPath}`);
        redirect(`/${locale}${kaasitomaPaths.loginPath}`);
    }

    const params = await searchParams;
    console.log("TopUpDetailsPage - Received searchParams:", params);

    const { receiverAccountId, countryId, topUpMethod } = params;

    // --- 1. Initial Validation of essential params ---
    if (!receiverAccountId || !countryId || !topUpMethod) {
        console.warn(`TopUpDetailsPage: Missing essential URL parameters. Redirecting.`);
        // Redirect to a more appropriate page, e.g., list of receiver accounts or an error page
        redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
    }

    const numericReceiverAccountId = parseInt(receiverAccountId, 10);
    const numericCountryId = parseInt(countryId, 10);

    let receiverAccount: ReceiverAccount | undefined;
    let country: Country | undefined; // Declare the country object

    try {
        // --- 2. Fetch Receiver Account details ---
        const receiverAccountPayload = await fetchBackendData<ReceiverAccountPayload>(
            `/kaasitoma/receiverAccounts/getReceiverAccountByReceiverAccountId?receiverAccountId=${numericReceiverAccountId}`,
            'GET',
            undefined,
            3600
        );

        if (receiverAccountPayload && receiverAccountPayload.receiverAccount) {
            receiverAccount = receiverAccountPayload.receiverAccount;
            console.log(`TopUpDetailsPage: Successfully fetched receiver account : ${receiverAccount}`);
        } else {
            console.warn(`TopUpDetailsPage: No receiver account data fetched or unexpected structure for ID ${numericReceiverAccountId}.`);
        }

        // --- 3. Fetch Country details ---
        const countryPayload = await fetchBackendData<CountryDataPayload>(
            `/kaasitoma/countries/getCountryByCountryId?countryId=${countryId}`, // Or a specific endpoint to get country by ID if available
            'GET',
            undefined,
            3600
        );

        if (countryPayload && countryPayload.country) {
            country = countryPayload.country;
            console.log(`TopUpDetailsPage: Successfully fetched receiver account ID ${country.countryId}`);
        } else {
            console.warn(`TopUpDetailsPage: No receiver account data fetched or unexpected structure for ID ${numericCountryId}.`);
        }

        if (!country) {
            console.warn(`TopUpDetailsPage: Country with ID ${numericCountryId} not found.`);
            // Redirect if the country cannot be found
            redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
        }

    } catch (error) {
        console.error(`TopUpDetailsPage: Error fetching required details for Receiver Account ID ${numericReceiverAccountId} or Country ID ${numericCountryId}: `, error);
        // Fallback or redirect on fetch error
        redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
    }

    // --- 4. Final Data Validation before rendering ---
    if (!receiverAccount || !country || receiverAccount.receiverAccountId === undefined || receiverAccount.receiverAccountId === null) {
        console.log(`TopUpDetailsPage: Missing essential data after fetch (receiverAccount or country). Redirecting to /${locale}/${kaasitomaPaths.receiverAccountsPath}.`);
        redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
    }

    return (
        <div className="
            w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
            bg-background/80 backdrop-blur-sm border border-border
            dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]
        ">
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                {t('pageTitle')}
            </h2>

            <CardContent className="flex-grow p-6 space-y-8">
                <TopUpDetailsForm
                    initialReceiverAccount={receiverAccount}
                    initialCountry={country} // Pass the fetched Country object
                    initialSearchParams={{ topUpMethod: topUpMethod }} // Pass only topUpMethod in searchParams
                />
            </CardContent>
        </div>
    );
}

export default TopUpDetailsPage;