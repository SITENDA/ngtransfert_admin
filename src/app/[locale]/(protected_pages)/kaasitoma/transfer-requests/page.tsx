// src/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/page.tsx
// This is a Server Component.

import getSession from "@/lib/getSession";
import { redirect } from 'next/navigation';
import {getLocale, getTranslations} from 'next-intl/server';
import { headers } from 'next/headers';

import {BackendGenericResponse} from "../../../../../../types/BackendGenericResponse";
import TransferRequestsForm from "@/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/TransferRequestsForm";
import {TransferRequest, TransferRequestsPayload} from "../../../../../../types/transfer-requests";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {kaasitomaPaths} from "@/util/frontend-paths";
import React from "react";

// URL for the Next.js API proxy that will fetch transfer requests from Spring Boot
// Now, we'll construct this URL to include the clientId as a query parameter.
const BASE_GET_TRANSFER_REQUESTS_PROXY_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/kaasitoma/transferRequests/getTransferRequestsForClient`;

export default async function TransferRequestsPage() {
    const t = await getTranslations('TransferRequestsPage');

    // 1. Authentication Check (Server-side Guard)
    const session = await getSession();
    const user = session?.user;
    const locale = await getLocale();

    if (!session || !user || !user.userId || !session.accessToken) {
        console.warn(`TransferRequestsPage: User not authenticated or missing required session data. Redirecting to /${locale}/login`);
        redirect(`/${locale}/login`);
    }

    const accessToken = session.accessToken;
    const clientId = user.userId; // Get clientId from authenticated user

    let transferRequests: TransferRequest[] = [];

    try {
        console.log(`TransferRequestsPage (Server Component): Fetching transfer requests for clientId: ${clientId} via proxy...`);

        // Construct the full URL with the clientId query parameter
        const GET_TRANSFER_REQUESTS_PROXY_URL = `${BASE_GET_TRANSFER_REQUESTS_PROXY_URL}?clientId=${clientId}`;


        // Get headers from the incoming client request to this server component
        const headersList = await headers();
        headersList.get('authorization');
        const cookieHeader = headersList.get('cookie');

        const response = await fetch(GET_TRANSFER_REQUESTS_PROXY_URL, {
            method: 'GET',
            headers: {
                // Ensure the Authorization header comes from the NextAuth session.
                // The proxy will then forward this to the Spring Boot backend.
                'Authorization': `Bearer ${accessToken}`,
                ...(cookieHeader && { 'Cookie': cookieHeader }), // Forward cookies if needed for session/refresh
            },
            next: {
                revalidate: 60
            }
        });

        if (!response.ok) {
            console.error(`TransferRequestsPage: Failed to fetch accounts from proxy: ${response.status} ${response.statusText}`);
            const errorBody = await response.json();
            console.error('TransferRequestsPage: Proxy error details:', errorBody);

            if (response.status === 401 || response.status === 403) {
                console.warn(`TransferRequestsPage: Authentication/Authorization issue fetching accounts. Redirecting to /${locale}/login`);
                redirect(`/${locale}/${kaasitomaPaths.loginPath}`);
            }
            transferRequests = [];
        } else {
            const backendResponse: BackendGenericResponse<TransferRequestsPayload> = await response.json();

            if (backendResponse.statusCode === 200 && backendResponse.data && backendResponse.data.transferRequests) {
                transferRequests = backendResponse.data.transferRequests;
                console.log(`TransferRequestsPage: Successfully fetched ${transferRequests.length} transfer requests.`);
            } else {
                console.warn("TransferRequestsPage: Backend response for accounts was OK, but 'data' or 'transferRequests' array was missing/empty:", backendResponse);
                transferRequests = [];
            }
        }
    } catch (error) {
        console.error("TransferRequestsPage: Network or unexpected error fetching transfer requests:", error);
        transferRequests = [];
    }

    return (
        <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-xl bg-background/80 backdrop-blur-sm border border-border
        dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]">
            {/* Main card container */}
            <Card className="w-full flex-grow mx-auto my-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col h-full max-w-screen-lg rounded-xl shadow-lg">
                <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">{t('pageTitle')}</CardTitle>
                </CardHeader>
                {/* CardContent to contain the form */}
                <CardContent className="flex-grow p-6 space-y-8">
                    <TransferRequestsForm initialTransferRequests={transferRequests} />
                </CardContent>
            </Card>


        </div>
    );
}
