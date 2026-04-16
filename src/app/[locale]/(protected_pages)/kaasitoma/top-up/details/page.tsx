// src/app/[locale]/(protected_pages)/kaasitoma/top-up/details/page.tsx

import React from 'react';
import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import getSession from "@/lib/getSession";
import { kaasitomaPaths } from "@/util/frontend-paths";
import { CardContent } from "@/components/ui/card";
import { ReceiverAccount } from "../../../../../../../types/receiver-account";
import {Country} from "../../../../../../../types/country"; // Import Country and its payload
import TopUpDetailsForm from "./TopUpDetailsForm";
import {ExchangeRate} from "../../../../../../../types/exchangeRateResult";
import {TopUpDetailsPayload} from "../../../../../../../types/request-top-up-request";
import {cookies, headers} from "next/headers";

interface TopUpDetailsPageProps {
    searchParams: Promise<{ // Query parameters from URL
        receiverAccountId: string;
        countryId: string; // This is now essential for fetching the country object
        topUpMethod: string; // Still needed for the form
    }>;
}

async function TopUpDetailsPage({ searchParams }: TopUpDetailsPageProps) {
    const t = await getTranslations('TopUpDetailsPage');
    const locale = await getLocale();

    const session = await getSession();
    const clientId = session?.user?.userId;
    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") ?? "https";
    const host = headersList.get("host");

    if (!host) {
        throw new Error("Host header missing");
    }


    if (!clientId) {
        console.warn(`TopUpDetailsPage: Client ID not found. Redirecting to /${locale}${kaasitomaPaths.loginPath}`);
        redirect(`/${locale}${kaasitomaPaths.loginPath}?ensobi=signedout`);
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
        const apiUrl = `${protocol}://${host}//api/kaasitoma/topUp/getTopUpDetails?receiverAccountId=${numericReceiverAccountId}&countryId=${numericCountryId}`;
        const cookieHeader = (await cookies())
                .getAll()
                .map((c) => `${c.name}=${c.value}`)
                .join("; ");

        const response = await fetch(apiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                Cookie: cookieHeader,
            },
        });

        const data: {
            success: boolean;
            data: TopUpDetailsPayload;
        } = await response.json();

        receiverAccount = data.data.receiverAccount;
        country = data.data.country;
        exchangeRate = data.data.exchangeRate;
        sendingFeePercentage = data.data.sendingFeePercentage;


    } catch (error) {
        console.error(`TopUpDetailsPage: Error fetching required top up details for Receiver Account ID ${numericReceiverAccountId} or Country ID ${numericCountryId}: `, error);
        // Fallback or redirect on fetch error
        // redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
    }

    // --- 4. Final Data Validation before rendering ---
    if (!receiverAccount || !country || !exchangeRate) {
        console.error("TopUpDetailsPage: Missing required data", {
            receiverAccount,
            country,
            exchangeRate,
        });

        return (
            <div className="text-center text-red-500">
                Failed to load top-up details. Please try again.
            </div>
        );
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