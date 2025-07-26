// src/app/[locale]/(protected_pages)/kaasitoma/top-up/page.tsx
// This is a Server Component.
import PublicWrapper from "@/components/PublicWrapper";
import {BackendGenericResponse} from "../../../../../../../types/BackendGenericResponse";
import {ResponseTopUpRequest, TopUpRequestsPayload} from "../../../../../../../types/response-top-up-request";
import getSession from "@/lib/getSession";
import { redirect } from 'next/navigation';
import {getLocale, getTranslations} from 'next-intl/server';
import { headers } from 'next/headers';
import { User } from 'next-auth';
import TopUpRequestsTable from "@/app/[locale]/(protected_pages)/kaasitoma/top-up/(requests)/TopUpRequestsTable";
import {JWT} from "next-auth/jwt";
import {Link} from "@/i18n/navigation";
import {kaasitomaPaths} from "@/util/frontend-paths";
import {Button} from "@/components/ui/button";


// URL for the Next.js API proxy that will fetch top up requests from Spring Boot
// Now, we'll construct this URL to include the clientId as a query parameter.
const GET_TOP_UP_REQUESTS_PROXY_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/kaasitoma//topUp/getAllTopUpRequests`;

export default async function TopUpRequestsPage() {
    const t = await getTranslations('TopUpRequestsPage');
    const locale = await getLocale();

    // 1. Authentication Check (Server-side Guard)
    const session = await getSession();
    const user: User | undefined | null = session?.user;

    if (!session || !user || !user.userId || !session.accessToken) {
        console.warn(`TopUpRequestsPage: User not authenticated or missing required session data. Redirecting to /${locale}/login`);
        redirect(`/${locale}/login`);
    }

    const tokenObject: JWT = session.accessToken;
    const clientId = user.userId; // Get clientId from authenticated user

    let topUpRequests: ResponseTopUpRequest[] = [];

    try {
        console.log(`TopUpRequestsPage (Server Component): Fetching top up requests for clientId: ${clientId} via proxy...`);

        // Get headers from the incoming client request to this server component
        const headersList = await headers();
        headersList.get('authorization');
        const cookieHeader = headersList.get('cookie');

        const response = await fetch(GET_TOP_UP_REQUESTS_PROXY_URL, {
            method: 'GET',
            headers: {
                // Ensure the Authorization header comes from the NextAuth session.
                // The proxy will then forward this to the Spring Boot backend.
                'Authorization': `Bearer ${tokenObject.accessToken}`,
                ...(cookieHeader && { 'Cookie': cookieHeader }), // Forward cookies if needed for session/refresh
            },
            next: {
                revalidate: 60
            }
        });

        if (!response.ok) {
            console.error(`TopUpRequestsPage: Failed to fetch accounts from proxy: ${response.status} ${response.statusText}`);
            const errorBody = await response.json();
            console.error('TopUpRequestsPage: Proxy error details:', errorBody);

            if (response.status === 401 || response.status === 403) {
                console.warn(`TopUpRequestsPage: Authentication/Authorization issue fetching accounts. Redirecting to /${locale}/login`);
                redirect(`/${locale}/login`);
            }
            topUpRequests = [];
        } else {
            const backendResponse: BackendGenericResponse<TopUpRequestsPayload> = await response.json();

            if (backendResponse.statusCode === 200 && backendResponse.data && backendResponse.data.topUpRequests) {
                topUpRequests = backendResponse.data.topUpRequests;
                // console.log(`TopUpRequestsPage: Successfully fetched ${topUpRequests.length} top up requests.`);
            } else {
                console.warn("TopUpRequestsPage: Backend response for accounts was OK, but 'data' or 'topUpRequests' array was missing/empty:", backendResponse);
                topUpRequests = [];
            }
        }
    } catch (error) {
        console.error("TopUpRequestsPage: Network or unexpected error fetching top up requests:", error);
        topUpRequests = [];
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
                    <Link href={`${kaasitomaPaths.receiverAccountsPath}?from=topUp`} passHref>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            {t('topUp')}
                        </Button>
                    </Link>
                </div>
                <TopUpRequestsTable initialTopUpRequests={topUpRequests} />
            </div>
        </PublicWrapper>
    );
}
