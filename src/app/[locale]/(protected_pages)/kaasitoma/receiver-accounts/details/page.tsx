// src/app/[locale]/(protected_pages)/kaasitoma/details/page.tsx

import ReceiverAccountDetailsForm from "./ReceiverAccountDetailsForm";
import PublicWrapper from "@/components/PublicWrapper";
// Removed next-intl imports as they are not resolvable in this environment
import getSession from "@/lib/getSession"; // Assuming getSession is available
import {redirect} from 'next/navigation';
import {kaasitomaPaths} from "@/util/frontend-paths"; // Assuming kaasitomaPaths is available
import {ReceiverAccount, ReceiverAccountPayload} from "../../../../../../../types/receiver-account"; // Import ReceiverAccountPayload
import {fetchBackendData} from "@/lib/backend-api-client";
import {CardHeader} from "@/components/ui/card";
// Replaced Next.js Link from next-intl/navigation with a standard <a> tag
// as it cannot be resolved in this environment.
import {Link} from "@/i18n/navigation"; // Import Link for navigation
import {Button} from "@/components/ui/button"; // Import the fetch utility

// Modify the page component to accept searchParams as a prop
async function ReceiverAccountDetailsPage({ searchParams }: { searchParams: { receiverAccountId?: string } }) {
    // Hardcoded strings for demonstration as next-intl is not resolvable
    const getTranslation = (key: string) => {
        switch (key) {
            case 'errorLoadingAccountDetails': return 'Error loading account details. Please try again.';
            case 'pageTitle': return 'Receiver Account Details';
            default: return key;
        }
    };
    // const t = await getTranslations('ReceiverAccountDetailsPage');
    // const locale = await getLocale(); // Not needed for hardcoded translations

    // The fetchBackendData utility (if used) handles authentication and redirects
    // if the user is not authenticated or the access token is missing.
    const session = await getSession();
    const clientId = session?.user?.userId; // Extract clientId after session is confirmed

    // If clientId is still not available after session check, it means authentication failed
    // or user data is incomplete, and fetchBackendData would have redirected.
    // This check acts as an additional safeguard before passing to client component.
    if (!clientId) {
        console.warn(`ReceiverAccountDetailsPage: Client ID not found after initial session check. Redirecting to /${kaasitomaPaths.loginPath}`);
        redirect(`/${kaasitomaPaths.loginPath}`);
    }

    let receiverAccount: ReceiverAccount | null = null; // Initialize receiverAccount
     // searchParams is already an object, no need for await
    // Access receiverAccountId directly from the searchParams prop
    const params = await searchParams;
    const receiverAccountId = params.receiverAccountId;

    try {
        if (receiverAccountId) {
            // Fetch receiver account details from the backend
            const response = await fetchBackendData<ReceiverAccountPayload>(
                `/kaasitoma/receiverAccounts/getReceiverAccountByReceiverAccountId?receiverAccountId=${receiverAccountId}`,
                'GET',
                undefined, // No body for GET request
                3600 // Revalidate every hour
            );

            if (response && response.receiverAccount) {
                // Destructure and filter out creationDate and lastUpdatedDate
                const { creationDate, lastUpdatedDate, ...restOfAccount } = response.receiverAccount;

                // Create a mutable copy to modify email/phoneNumber
                const processedAccount: ReceiverAccount = { ...restOfAccount };

                // Ignore email or phone number if they start with "rand_"
                if (processedAccount.email && processedAccount.email.startsWith('rand_')) {
                    processedAccount.email = undefined; // Set to undefined to ignore display
                }
                if (processedAccount.phoneNumber && processedAccount.phoneNumber.startsWith('rand_')) {
                    processedAccount.phoneNumber = undefined; // Set to undefined to ignore display
                }

                receiverAccount = processedAccount;
                console.log("ReceiverAccountDetailsPage: Successfully fetched and processed receiver account from backend.");
            } else {
                console.warn("ReceiverAccountDetailsPage: No receiver account data fetched or data structure unexpected from backend.");
            }
        } else {
            console.warn("ReceiverAccountDetailsPage: No 'receiverAccountId' parameter found in URL for receiver account details.");
            // Optionally redirect or show an error if data is missing
            // redirect(`/kaasitoma/receiver-accounts`); // Example redirect back to list
        }
    } catch (error) {
        console.error("ReceiverAccountDetailsPage: Error during receiver account data fetching process:", error);
        receiverAccount = null; // Ensure it's null on parsing error
        // Optionally redirect or show an error if data is malformed
        // redirect(`/kaasitoma/receiver-accounts`); // Example redirect
    }

    if (!receiverAccount) {
        // If receiverAccount is still null after fetching attempts (e.g., missing or malformed data),
        // display an error or redirect.
        return (
            <PublicWrapper>
                <div className="
                    w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                    bg-background/80 backdrop-blur-sm border border-border
                    dark:bg-gray-800/80 dark:border-gray-700 min-h-[400px] flex items-center justify-center
                ">
                    <h2 className="text-2xl font-bold text-center text-red-500">
                        {getTranslation('errorLoadingAccountDetails')} {/* New translation key for error */}
                    </h2>
                </div>
            </PublicWrapper>
        );
    }

    return (
        <PublicWrapper>
            <div className="
                w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]
            ">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                    {getTranslation('pageTitle')}
                </h2>
                <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    {/* Updated Top Up button styling */}
                    <Link href={`${kaasitomaPaths.topUpCountryAndMethodPath}${receiverAccountId}`} passHref>
                        <Button variant="outline"
                                size="sm"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            Top Up
                        </Button>
                    </Link>
                    {/* Updated Request for Transfer button styling */}
                    <Link href={`${kaasitomaPaths.applyForTransferPath}${receiverAccountId}`} passHref>
                        <Button variant="outline"
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            Request for Transfer
                        </Button>
                    </Link>
                </CardHeader>
                {/* Pass the processed receiverAccount object to the client component */}
                <ReceiverAccountDetailsForm receiverAccount={receiverAccount} />
            </div>
        </PublicWrapper>
    );
}

export default ReceiverAccountDetailsPage;
