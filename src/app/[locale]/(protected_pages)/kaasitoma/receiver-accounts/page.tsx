// src/app/[locale]/(protected_pages)/kaasitoma/receiver-accounts/page.tsx
// This is a Server Component.

import { auth } from "@/auth";
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { User } from 'next-auth';

import ReceiverAccountsForm from "./ReceiverAccountsForm";
import PublicWrapper from "@/components/PublicWrapper";
import {
    BackendGenericResponse,
    ReceiverAccount,
    ReceiverAccountsPayload
} from "../../../../../../types/receiver-account";

type Props = {
    params: { locale: string };
};

// URL for the Next.js API proxy that will fetch receiver accounts from Spring Boot
// Now, we'll construct this URL to include the clientId as a query parameter.
const BASE_GET_RECEIVER_ACCOUNTS_PROXY_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/kaasitoma/receiverAccounts/getAllReceiverAccounts`;

export default async function ReceiverAccountsPage({ params }: Props) {
    const t = await getTranslations('ReceiverAccountsPage');

    // 1. Authentication Check (Server-side Guard)
    const session = await auth();
    const user: User | undefined | null = session?.user;

    if (!session || !user || !user.userId || !session.accessToken) {
        console.warn(`ReceiverAccountsPage: User not authenticated or missing required session data. Redirecting to /${params.locale}/login`);
        redirect(`/${params.locale}/login`);
    }

    const accessToken = session.accessToken;
    const clientId = user.userId; // Get clientId from authenticated user

    let receiverAccounts: ReceiverAccount[] = [];

    try {
        console.log(`ReceiverAccountsPage (Server Component): Fetching receiver accounts for clientId: ${clientId} via proxy...`);

        // Construct the full URL with the clientId query parameter
        const GET_RECEIVER_ACCOUNTS_PROXY_URL = `${BASE_GET_RECEIVER_ACCOUNTS_PROXY_URL}?clientId=${clientId}`;


        // Get headers from the incoming client request to this server component
        const headersList = await headers();
        headersList.get('authorization');
        const cookieHeader = headersList.get('cookie');

        const response = await fetch(GET_RECEIVER_ACCOUNTS_PROXY_URL, {
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
            console.error(`ReceiverAccountsPage: Failed to fetch accounts from proxy: ${response.status} ${response.statusText}`);
            const errorBody = await response.json();
            console.error('ReceiverAccountsPage: Proxy error details:', errorBody);

            if (response.status === 401 || response.status === 403) {
                console.warn(`ReceiverAccountsPage: Authentication/Authorization issue fetching accounts. Redirecting to /${params.locale}/login`);
                redirect(`/${params.locale}/login`);
            }
            receiverAccounts = [];
        } else {
            const backendResponse: BackendGenericResponse<ReceiverAccountsPayload> = await response.json();

            if (backendResponse.statusCode === 200 && backendResponse.data && backendResponse.data.receiverAccounts) {
                receiverAccounts = backendResponse.data.receiverAccounts;
                console.log(`ReceiverAccountsPage: Successfully fetched ${receiverAccounts.length} receiver accounts.`);
            } else {
                console.warn("ReceiverAccountsPage: Backend response for accounts was OK, but 'data' or 'receiverAccounts' array was missing/empty:", backendResponse);
                receiverAccounts = [];
            }
        }
    } catch (error) {
        console.error("ReceiverAccountsPage: Network or unexpected error fetching receiver accounts:", error);
        receiverAccounts = [];
    }

    return (
        <PublicWrapper>
            <div className="
                w-full max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]
            ">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                    {t('pageTitle')}
                </h2>
                <ReceiverAccountsForm initialReceiverAccounts={receiverAccounts} />
            </div>
        </PublicWrapper>
    );
}
