// src/app/[locale]/(protected_pages)/kaasitoma/receiver-accounts/page.tsx
// This is a Server Component.

import getSession from "@/lib/getSession";
import { redirect } from 'next/navigation';
import {getLocale, getTranslations} from 'next-intl/server';
import { headers } from 'next/headers';
import {Session, User} from 'next-auth';

import ReceiverAccountsTable from "./ReceiverAccountsTable";
import PublicWrapper from "@/components/PublicWrapper";
import {
    ReceiverAccount,
    ReceiverAccountsPayload
} from "../../../../../../types/receiver-account";
import {BackendGenericResponse} from "../../../../../../types/BackendGenericResponse";
import {JWT} from "next-auth/jwt";
import {kaasitomaPaths} from "@/util/frontend-paths";
import {Button} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";

// URL for the Next.js API proxy that will fetch receiver accounts from Spring Boot
// Now, we'll construct this URL to include the clientId as a query parameter.
const BASE_GET_RECEIVER_ACCOUNTS_PROXY_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/kaasitoma/receiverAccounts/getAllReceiverAccounts`;

export default async function ReceiverAccountsPage() {
    const t = await getTranslations('ReceiverAccountsPage');
    const locale = await getLocale();

    // 1. Authentication Check (Server-side Guard)
    const session: Session | null = await getSession();
    const user: User | undefined | null = session?.user;

    if (!session || !user || !user.userId || !session.accessToken) {
        console.warn(`ReceiverAccountsPage: User not authenticated or missing required session data. Redirecting to /${locale}/login`);
        redirect(`/${locale}/login`);
    }

    const tokenObject: JWT = session?.accessToken;
    const clientId = user.userId; // Get clientId from authenticated user

    let receiverAccounts: ReceiverAccount[] = [];

    try {
        console.log(`ReceiverAccountsPage (Server Component): Fetching receiver accounts for clientId: ${clientId} via proxy...`);

        // Get headers from the incoming client request to this server component
        const headersList = await headers();
        headersList.get('authorization');
        const cookieHeader = headersList.get('cookie');

        const response = await fetch(BASE_GET_RECEIVER_ACCOUNTS_PROXY_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenObject.accessToken}`,
                ...(cookieHeader && { 'Cookie': cookieHeader }),
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
                console.warn(`ReceiverAccountsPage: Authentication/Authorization issue fetching accounts. Redirecting to /${locale}/login`);
                redirect(`/${locale}/login`);
            }
            receiverAccounts = [];
        } else {
            const backendResponse: BackendGenericResponse<ReceiverAccountsPayload> = await response.json();

            if (backendResponse.statusCode === 200 && backendResponse.data && backendResponse.data.receiverAccounts) {
                receiverAccounts = backendResponse.data.receiverAccounts;
                // console.log(`ReceiverAccountsPage: Successfully fetched ${receiverAccounts.length} receiver accounts.`);
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
                <div className="flex justify-end mb-6">
                    <Link href={kaasitomaPaths.addReceiverAccountPath} passHref>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            {t('addReceiverAccountButton')}
                        </Button>
                    </Link>
                </div>
                <ReceiverAccountsTable initialReceiverAccounts={receiverAccounts} />
            </div>
        </PublicWrapper>
    );
}
