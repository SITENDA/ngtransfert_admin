// src/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/apply-for-transfer/page.tsx
// This is a Server Component.

import React from 'react';
import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import getSession from "@/lib/getSession"; // Assuming getSession is available
import { kaasitomaPaths } from "@/util/frontend-paths"; // Assuming kaasitomaPaths is available
import { CardContent } from "@/components/ui/card"; // Import Card components

import ApplyForTransferForm from "@/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/apply-for-transfer/ApplyForTransferForm";
import { fetchBackendData } from "@/lib/backend-api-client"; // Import the new reusable fetch utility
import { Country, CountryDataPayload } from "../../../../../../../types/country";
import {ReceiverAccountPayload} from "../../../../../../../types/receiver-account";

interface ApplyForTransferPageProps {
    searchParams: { // Query parameters from Spring Boot redirect
        receiverAccountId?: string; // The access token from Spring Boot
    };
}

async function ApplyForTransferPage({ searchParams }: ApplyForTransferPageProps) {
    const t = await getTranslations('ApplyForTransferPage');
    const locale = await getLocale();
    const params = await searchParams;

    const session = await getSession();
    const clientId = session?.user?.userId;

    if (!clientId) {
        console.warn(`ApplyForTransferPage: Client ID not found after initial session check. Redirecting to /${kaasitomaPaths.loginPath}`);
        redirect(kaasitomaPaths.loginPath);
    }

    const receiverAccountId = params.receiverAccountId

    if (!receiverAccountId) {
        console.warn(`ApplyForTransferPage: Receiver Account ID not found after initial session check. Redirecting to /${kaasitomaPaths.receiverAccountsPath}`);
        redirect(kaasitomaPaths.receiverAccountsPath);
    }

    let countries: Country[] = [];
    let receiverAccount;

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


        // Fetch receiver account payload
        const receiverAccountPayload = await fetchBackendData<ReceiverAccountPayload>(
            `/kaasitoma/receiverAccounts/getReceiverAccountByReceiverAccountId?receiverAccountId=${receiverAccountId}`, // Use the provided backend endpoint
            'GET',
            undefined,
            3600 // Revalidate every hour
        );

        if (receiverAccountPayload && receiverAccountPayload.receiverAccount) {
            receiverAccount = receiverAccountPayload.receiverAccount;
            console.log(`ApplyForTransferPage: Successfully fetched receiver account ID ${receiverAccount.receiverAccountId}`);
        } else {
            console.warn("ApplyForTransferPage: No receiver account data fetched or data structure unexpected from backend.");
        }

    } catch (error) {
        console.error("ApplyForTransferPage: Error during data fetching process (countries or receiver account):", error);
        countries = []; // Ensure countries is an empty array on error
    }

    if (receiverAccount?.receiverAccountId == undefined || receiverAccount == null) {
        console.log(`ApplyForTransferPage: No account found for receiver account, redirecting to  ${kaasitomaPaths.receiverAccountsPath}.`);
        redirect(kaasitomaPaths.receiverAccountsPath);
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
                    {/* Pass the fetched countries and receiver account data, and the guaranteed clientId to the client component */}
                    <ApplyForTransferForm initialCountries={countries} clientId={clientId} receiverAccount={receiverAccount}/>
                </CardContent>
            </div>
        </>
    );
}

export default ApplyForTransferPage;
