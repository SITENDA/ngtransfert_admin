// src/app/[locale]/(protected_pages)/kaasitoma/details-requests/details/page.tsx
// This is a Server Component.

import React from 'react';
import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import getSession from "@/lib/getSession"; // Assuming getSession is available
import { kaasitomaPaths } from "@/util/frontend-paths"; // Assuming kaasitomaPaths is available
import { CardContent } from "@/components/ui/card"; // Import Card components
import { fetchBackendData } from "@/lib/backend-api-client"; // Import the new reusable fetch utility
import {ReceiverAccountPayload, ReceiverAccount} from "../../../../../../../../types/receiver-account"; // Import ReceiverAccountPayload and ReceiverAccount
import CountryAndMethodSelectorForm from "./CountryAndMethodSelectorForm";
import {Country, CountriesDataPayload} from "../../../../../../../../types/country";
import {isRedirectObject} from "@/util/typeguards"; // Import the TopUpDetailsForm client component

interface CountryAndMethodSelectorPageProps {
    searchParams: { // Query parameters from URL
        receiverAccountId?: string;
    };
}

async function CountryAndMethodSelectorPage({ searchParams }: CountryAndMethodSelectorPageProps) {
    const t = await getTranslations('CountryAndMethodSelectorPage'); // Translations for this page
    const locale = await getLocale(); // Current locale

    // Get client session to ensure authentication and retrieve clientId
    const session = await getSession();
    const clientId = session?.user?.userId;

    // Redirect to login if client ID is not found (user not authenticated or session invalid)
    if (!clientId) {
        console.warn(`TopUpPage: Client ID not found. Redirecting to /${locale}${kaasitomaPaths.loginPath}`);
        redirect(`/${locale}${kaasitomaPaths.loginPath}?ensobi=signedout`);
    }

    const params = await searchParams;
    // Extract receiverAccountId from URL search parameters
    const receiverAccountId = await params.receiverAccountId;

    // Redirect if receiverAccountId is missing from the URL
    if (!receiverAccountId) {
        console.warn(`TopUpPage: Receiver Account ID not found in URL. Redirecting to /${locale}/${kaasitomaPaths.receiverAccountsPath}`);
        // Redirect to a more appropriate page, e.g., list of receiver accounts or an error page
        redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
    }

    let receiverAccount: ReceiverAccount | undefined; // Initialize receiverAccount
    let countries: Country[] = [];

    try {
        // Fetch Receiver Account details from the backend
        const receiverAccountPayload = await fetchBackendData<ReceiverAccountPayload>(
            `/kaasitoma/receiverAccounts/getReceiverAccountByReceiverAccountId?receiverAccountId=${receiverAccountId}`, // Use the backend endpoint
            'GET',
            undefined, // No request body for GET
            3600 // Revalidate every hour (cache control)
        );
        if (isRedirectObject(receiverAccountPayload)) {
            redirect(receiverAccountPayload.redirectTo);
        }

        if (receiverAccountPayload && receiverAccountPayload.receiverAccount) {
            receiverAccount = receiverAccountPayload.receiverAccount;
            console.log(`TopUpPage: Successfully fetched receiver account ID ${receiverAccount.receiverAccountId}`);
        } else {
            console.warn(`TopUpPage: No receiver account data fetched or unexpected structure for ID ${receiverAccountId}.`);
        }

        // Fetch countries
        const countryPayload = await fetchBackendData<CountriesDataPayload>(
            '/kaasitoma/countries/getPriorityCountries',
            'GET',
            undefined,
            3600
        );
        if (isRedirectObject(countryPayload)) {
            redirect(countryPayload.redirectTo);
        }

        if (countryPayload && countryPayload.countries) {
            countries = countryPayload.countries;
            // console.log(`ApplyForTransferPage: Successfully fetched ${countries.length} countries.`);
        } else {
            console.warn("ApplyForTransferPage: No country data fetched or data structure unexpected from backend.");
        }

    } catch (error) {
        console.error(`TopUpPage: Error fetching receiver account details for ID ${receiverAccountId}: or countries`, error);
    }

    // If receiverAccount is still not found after fetching, redirect to a safe page
    if (!receiverAccount || receiverAccount.receiverAccountId === undefined || receiverAccount.receiverAccountId === null) {
        console.log(`TopUpPage: No valid receiver account found for ID ${receiverAccountId}. Redirecting to /${locale}/${kaasitomaPaths.receiverAccountsPath}.`);
        redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`); // Redirect to receiver accounts list
    }

    return (
        <div className="
            w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
            bg-background/80 backdrop-blur-sm border border-border
            dark:bg-gray-800/80 dark:border-gray-700 min-h-[400px]
        ">
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                {t('pageTitle')}
            </h2>

            <CardContent className="flex-grow p-6 space-y-8">
                {/* Pass the fetched receiver account and clientId to the client component */}
                <CountryAndMethodSelectorForm initialCountries={countries} initialReceiverAccount={receiverAccount} />
            </CardContent>
        </div>
    );
}

export default CountryAndMethodSelectorPage;
