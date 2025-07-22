// src/app/[locale]/(protected_pages)/kaasitoma/details-requests/details/page.tsx
// This is a Server Component.

import React from 'react';
import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import getSession from "@/lib/getSession";
import { kaasitomaPaths } from "@/util/frontend-paths";
import { CardContent } from "@/components/ui/card";
import { fetchBackendData } from "@/lib/backend-api-client";
import { ReceiverAccount } from "../../../../../../../types/receiver-account";
import {Country} from "../../../../../../../types/country"; // Import Country and its payload
import TopUpDetailsForm from "./TopUpDetailsForm";
import {ExchangeRate} from "../../../../../../../types/exchangeRateResult";
import {TopUpDetailsPayload} from "../../../../../../../types/request-top-up-request";
import {isRedirectObject} from "@/util/typeguards";

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
    let country: Country | undefined;
    let exchangeRate: ExchangeRate | undefined; // Make sure ExchangeRateResult is correctly imported
    let sendingFeePercentage: number | undefined;

    try {
        // --- 2. Fetch Receiver Account details, Country, and Exchange Rate ---
        const topUpDetailsPayload = await fetchBackendData<TopUpDetailsPayload>(
            `/kaasitoma/topUp/getTopUpDetails?receiverAccountId=${numericReceiverAccountId}&countryId=${numericCountryId}`, // FIXED HERE
            'GET',
            undefined,
            3600
        );

        if (isRedirectObject(topUpDetailsPayload)) {
            redirect(topUpDetailsPayload.redirectTo);
        }

        if (topUpDetailsPayload && topUpDetailsPayload.receiverAccount && topUpDetailsPayload.country && topUpDetailsPayload.exchangeRate) { // Ensure exchangeRate is checked here
            receiverAccount = topUpDetailsPayload.receiverAccount;
            country = topUpDetailsPayload.country;
            exchangeRate = topUpDetailsPayload.exchangeRate;
            sendingFeePercentage = topUpDetailsPayload.sendingFeePercentage;


            console.log("ExchangeRate: ", exchangeRate);

            console.log(`TopUpDetailsPage: Successfully fetched top up details for receiverAccountId: ${receiverAccount.receiverAccountId}`);
        } else {
            console.warn(`TopUpDetailsPage: No top up details fetched or unexpected structure for Receiver Account ID ${numericReceiverAccountId} and CountryId ${countryId}.`);
        }

        if (!country) {
            console.warn(`TopUpDetailsPage: Country with ID ${numericCountryId} not found after fetch.`);
            // Redirect if the country cannot be found
            redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
        }

        if (!exchangeRate) {
            console.warn(`TopUpDetailsPage: Exchange Rate for Country ID ${numericCountryId} not found after fetch.`);
            // Redirect if the exchange rate cannot be found
            redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
        }

        if (sendingFeePercentage == undefined || sendingFeePercentage < 0) {
            console.warn(`TopUpDetailsPage: Sending fee for Country ID ${numericCountryId} not found after fetch.`);
            // Redirect if the exchange rate cannot be found
            redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
        }

    } catch (error) {
        console.error(`TopUpDetailsPage: Error fetching required top up details for Receiver Account ID ${numericReceiverAccountId} or Country ID ${numericCountryId}: `, error);
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
                    initialCountry={country}
                    initialExchangeRate={exchangeRate}
                    initialSearchParams={{ topUpMethod: topUpMethod }}
                    sendingFeePercentage={sendingFeePercentage}
                />
            </CardContent>
        </div>
    );
}

export default TopUpDetailsPage;