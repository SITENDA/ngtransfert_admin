// src/app/[locale]/(protected_pages)/kaasitoma/add-receiver-account/page.tsx
// This file is a Server Component by default in the App Router.
// No "use client" here!

import AddReceiverAccountForm from "./AddReceiverAccountForm";
import PublicWrapper from "@/components/PublicWrapper";
import { Bank, BankDataPayload } from "../../../../../../../types/bank"; // Assuming these types exist
import { getLocale, getTranslations } from 'next-intl/server';
import getSession from "@/lib/getSession"; // Assuming getSession is available
import { redirect } from 'next/navigation';
import { kaasitomaPaths } from "@/util/frontend-paths"; // Assuming kaasitomaPaths is available
import { fetchBackendData } from "@/lib/backend-api-client"; // Import the new reusable fetch utility

async function AddReceiverAccountPage() {
    const t = await getTranslations('AddReceiverAccountPage');
    const locale = await getLocale();

    // The fetchBackendData utility now handles authentication and redirects
    // if the user is not authenticated or the access token is missing.
    // So, we primarily need the session here if `clientId` is explicitly passed to the form.
    const session = await getSession();
    const clientId = session?.user?.userId; // Extract clientId after session is confirmed

    // If clientId is still not available after session check, it means authentication failed
    // or user data is incomplete, and fetchBackendData would have redirected.
    // This check acts as an additional safeguard before passing to client component.
    if (!clientId) {
        console.warn(`AddReceiverAccountPage: Client ID not found after initial session check. Redirecting to /${locale}/${kaasitomaPaths.loginPath}`);
        redirect(`/${locale}/${kaasitomaPaths.loginPath}`);
    }

    let banks: Bank[] = [];
    const countryName = "China"; // This can be made dynamic based on user context or selection

    try {
        // Use the refactored fetchBackendData for fetching banks
        const bankPayload = await fetchBackendData<BankDataPayload>(
            `/kaasitoma/banks/getAllBanksByCountryName?countryName=${countryName}`,
            'GET',
            undefined, // No body for GET request
            3600       // Revalidate every hour
        );

        if (bankPayload && bankPayload.banks) {
            banks = bankPayload.banks;
            console.log(`AddReceiverAccountPage: Successfully fetched ${banks.length} banks for ${countryName}.`);
        } else {
            console.warn("AddReceiverAccountPage: No bank data fetched or data structure unexpected from backend.");
        }
    } catch (error) {
        console.error("AddReceiverAccountPage: Error during bank data fetching process:", error);
        banks = []; // Ensure banks is an empty array on error
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
