// src/app/[locale]/(protected_pages)/kaasitoma/add-receiver-account/page.tsx
// This file is a Server Component by default in the App Router.
// No "use client" here!

import AddReceiverAccountForm from "./AddReceiverAccountForm";
import PublicWrapper from "@/components/PublicWrapper";
import { BackendHttpResponse, Bank, BankDataPayload } from "../../../../../../types/bank";
import { getTranslations } from 'next-intl/server';
import { auth } from "@/auth";
import { User } from "next-auth"; // Import User type from next-auth
import { redirect } from 'next/navigation'; // <-- Import redirect function

type Props = {
    // Add params to the props to access the locale
    params: { locale: string };
};

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL || 'http://localhost:8080';

async function AddReceiverAccountPage({ params }: Props) { // Destructure params from props
    // Get translations for the current locale
    const t = await getTranslations('AddReceiverAccountPage');

    // Fetch the session. This is a Server Component, so `auth()` is appropriate.
    const session = await auth();
    // Safely get the user object. It can be null or undefined if not authenticated.
    const user: User | undefined | null = session?.user;

    // --- Authentication Guard and Redirection Logic ---
    // If there's no session, or no user object in the session, or user.userId is missing,
    // redirect to the login page for the current locale.
    if (!session || !user || !user.userId) {
        console.warn(`AddReceiverAccountPage: User is not authenticated or userId is missing. Redirecting to /${params.locale}/login`);
        // Use params.locale to ensure the redirect is locale-aware
        redirect(`/${params.locale}/login`);
    }

    // Now, `user` and `user.userId` are guaranteed to be defined because of the redirect above.
    const clientId = user.userId;

    let banks: Bank[] = [];
    const countryName = "China"; // Example: can be made dynamic based on user or other context

    try {
        // Since we are already authenticated via `auth()` helper,
        // and assuming your `auth()` helper properly establishes sessions and potentially cookies,
        // you might not need to manually parse `refreshToken` from cookies for this fetch,
        // IF your backend already handles session cookies or your `session.accessToken` is sufficient.
        // However, if your `BACKEND_API_BASE_URL` is a different origin and relies on the Authorization header,
        // we'll explicitly use session.accessToken for this server-to-server fetch.

        // Get accessToken from session for server-side fetch to backend
        const accessToken = session.accessToken; // Assumes accessToken is populated in session via NextAuth.js callbacks

        if (!accessToken) {
            console.warn("AddReceiverAccountPage: Access token not found in session for fetching banks. Redirecting to login.");
            redirect(`/${params.locale}/login`); // Redirect if access token is unexpectedly missing
        }

        // Make the authenticated fetch request to your backend
        const response = await fetch(`${BACKEND_API_BASE_URL}/kaasitoma/banks/getAllBanksByCountryName?countryName=${countryName}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Use accessToken from NextAuth session
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!response.ok) {
            console.error(`AddReceiverAccountPage: Failed to fetch banks: ${response.status} ${response.statusText}`);
            if (response.status === 401 || response.status === 403) {
                console.error("AddReceiverAccountPage: Server-side bank fetch failed due to Authentication or Authorization. Redirecting to login.");
                redirect(`/${params.locale}/login`); // Redirect on auth/authz issues with bank fetch
            }
            banks = []; // Fallback to empty banks on other errors
        } else {
            const backendResponse: BackendHttpResponse<BankDataPayload> = await response.json();

            if (backendResponse.statusCode === 200 && backendResponse.data && backendResponse.data.banks) {
                banks = backendResponse.data.banks;
            } else {
                console.warn("AddReceiverAccountPage: Backend response for banks was OK, but 'data' or 'banks' array was missing/empty:", backendResponse);
                banks = [];
            }
        }
    } catch (error) {
        console.error("AddReceiverAccountPage: Error fetching banks:", error);
        banks = []; // Handle network errors or JSON parsing errors
    }

    return (
        <PublicWrapper>
            <div className="
                w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]
            ">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                    {t('pageTitle')}
                </h2>
                {/* Pass the fetched banks data and the guaranteed clientId to the client component */}
                <AddReceiverAccountForm initialBanks={banks} clientId={clientId} />
            </div>
        </PublicWrapper>
    );
}

export default AddReceiverAccountPage;