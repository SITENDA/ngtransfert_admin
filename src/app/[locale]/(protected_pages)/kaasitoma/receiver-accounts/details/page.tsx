// src/app/[locale]/(protected_pages)/kaasitoma/details/page.tsx
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
import {Button} from "@/components/ui/button";
import CategoryIcon from "@/components/CategoryIcon";
import Image from "next/image";
import CountryFlag from "@/components/CountryFlag";
import React from "react";
import {getTranslations} from "next-intl/server";
import {isRedirectObject} from "@/util/typeguards"; // Import the fetch utility

interface DetailRowProps {
    label: string;
    value?: React.ReactNode;
    children?: React.ReactNode;
}

// Modify the page component to accept searchParams as a prop
async function ReceiverAccountDetailsPage({ searchParams }: { searchParams: { receiverAccountId?: string } }) {
    const t = await getTranslations('ReceiverAccountDetailsPage');
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
            if (isRedirectObject(response)) {
                redirect(response.redirectTo);
            }

            if (response && response.receiverAccount) {
                // Create a mutable copy to modify email/phoneNumber
                const processedAccount = response.receiverAccount;
                // Ignore email or phone number if they start with "rand_"
                if (processedAccount.email && processedAccount.email.startsWith('rand_')) {
                    processedAccount.email = undefined; // Set to undefined to ignore display
                }
                if (processedAccount.phoneNumber && processedAccount.phoneNumber.startsWith('rand_')) {
                    processedAccount.phoneNumber = undefined; // Set to undefined to ignore display
                }

                receiverAccount = processedAccount;
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
                        {t('errorLoadingAccountDetails')} {/* New translation key for error */}
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
                    {t('pageTitle')}
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
                <div className="space-y-6">
                    {/* General Account Details Section */}
                    <section className="p-6 rounded-lg shadow-inner bg-background-light dark:bg-gray-700/50 border border-border">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">
                            {t('generalDetails')}
                        </h3>
                        <DetailRow label={t('receiverAccountCategory')}>
                            <div className=" items-center gap-2">
                                <span>{t(receiverAccount.receiverAccountCategory.toLowerCase())}&nbsp; </span>
                                <CategoryIcon category={receiverAccount.receiverAccountCategory} />
                            </div>
                        </DetailRow>
                        <DetailRow label={t('receiverAccountIdentifier')} value={t(receiverAccount.receiverAccountIdentifier.toLowerCase())} />
                        <DetailRow label={t('receiverAccountName')} value={receiverAccount.receiverAccountName} />


                        {/* Conditional fields that might be present */}
                        {receiverAccount.qrCodeUrl && (
                            <DetailRow label={t('qrCodeImage')}>
                                <a href={receiverAccount.qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {t('viewImage')}
                                </a>
                            </DetailRow>
                        )}
                        {receiverAccount.email && <DetailRow label={t('email')} value={receiverAccount.email} />}
                        {receiverAccount.phoneNumber && <DetailRow label={t('phoneNumber')} value={receiverAccount.phoneNumber} />}
                    </section>

                    {/* Balance & Limit Section */}
                    <section className="p-6 rounded-lg shadow-inner bg-background-light dark:bg-gray-700/50 border border-border">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">
                            {t('accountLimits')}
                        </h3>

                        <DetailRow label={t('accountBalance')}>
                            {`${receiverAccount.balance.toLocaleString()} ${receiverAccount.currency?.currencyCode || ''}`}
                        </DetailRow>

                        {receiverAccount.limit !== undefined && (
                            <DetailRow label={t('accountLimit')}>
                                {`${receiverAccount.limit.toLocaleString()} ${receiverAccount.limitCurrency?.currencyCode || ''}`}
                            </DetailRow>
                        )}
                    </section>


                    {/* Bank Details Section - Conditional on it being a BANK_ACCOUNT */}
                    {receiverAccount.receiverAccountCategory === 'BANK_ACCOUNT' && (
                        <section className="p-6 rounded-lg shadow-inner bg-background-light dark:bg-gray-700/50 border border-border mt-6">
                            <h3 className="text-xl font-semibold mb-4 text-foreground">
                                {t('bankDetails')}
                            </h3>
                            {receiverAccount.bankAccountNumber && <DetailRow label={t('bankAccountNumber')} value={receiverAccount.bankAccountNumber} />}
                            {receiverAccount.cardHolderName && <DetailRow label={t('cardHolderName')} value={receiverAccount.cardHolderName} />}
                            {receiverAccount.bank?.bankName && <DetailRow label={t('bankName')} value={receiverAccount.bank.bankName} />}
                            {receiverAccount.bank?.bankLogoUrl && (
                                <DetailRow label={t('bankLogo')}>
                                    <Image
                                        src={receiverAccount.bank.bankLogoUrl}
                                        alt={receiverAccount.bank?.bankName || 'Bank Logo'}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-contain border border-gray-200 dark:border-gray-600 p-1"
                                    />
                                </DetailRow>
                            )}
                            {receiverAccount.bank?.country?.countryName && (
                                <DetailRow label={t('bankCountry')}>
                            <span className="flex items-center gap-2">
                                {receiverAccount.bank.country.countryName}
                                {receiverAccount.bank.country.countryFlagUrl && (
                                    <CountryFlag
                                        flagUrl={receiverAccount.bank.country.countryFlagUrl}
                                        alt={receiverAccount.bank.country.countryName}
                                        style={{ width: '24px', height: '18px' }}
                                    />
                                )}
                            </span>
                                </DetailRow>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </PublicWrapper>
    );
}

const DetailRow: React.FC<DetailRowProps> = async ({ label, value, children }) => {
    const t = await getTranslations('ReceiverAccountDetailsPage');
    return (
        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-border-light last:border-b-0">
            <div className="sm:w-1/3 text-muted-foreground font-medium mb-1 sm:mb-0 pr-4">
                {label}:
            </div>
            <div className="sm:w-2/3 text-foreground break-words">
                {value !== undefined && value !== null && value !== '' ? value : (children || t('notApplicable'))}
            </div>
        </div>
    );
};

export default ReceiverAccountDetailsPage;
