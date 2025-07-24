// src/app/[locale]/(protected_pages)/kaasitoma/details-requests/details/instructions/page.tsx
// This is a Server Component.
import React from 'react';
import {notFound, redirect} from 'next/navigation';
import { getTranslations } from 'next-intl/server'; // For server component translations

import { fetchBackendData } from "@/lib/backend-api-client"; // Assuming this is your utility for backend calls
import { CountriesDataPayload } from "../../../../../../../../types/country"; // Assuming this type is available
import { TopUpMethodEnum } from '@/enums/TopUpMethodEnum';
import {CashDepositAddress, CashDepositAddressDataPayload} from "../../../../../../../../types/cashDepositAddress";
import {BankDepositAddress, BankDepositAddressDataPayload} from "../../../../../../../../types/bankDepositAddress";
import {CardContent, Divider} from "@mui/material";
import {Button} from "@/components/ui/button";
import {kaasitomaPaths} from "@/util/frontend-paths";
import { Link } from '@/i18n/navigation';
import {FetchBackendResult} from "../../../../../../../../types/fetchBackendResult";
import {isRedirectObject} from "@/util/typeguards";

// --- UI Components (Simulated with HTML/Tailwind) ---


// Define the type for the query parameters expected by this page
interface InstructionsPageProps {
    searchParams: {
        accountId?: string;
        countryId?: string;
        topUpMethod?: string;
        receiverAccountCategory?: string;
        accountIdentifier?: string;
    };
}

export default async function InstructionsPage({ searchParams }: InstructionsPageProps) {
    const params = await searchParams;
    const t = await getTranslations('InstructionsPage'); // Use server-side translations

    const { accountId, countryId, topUpMethod, receiverAccountCategory, accountIdentifier } = params;

    // --- 1. Validate incoming query parameters ---
    if (!accountId || !countryId || !topUpMethod || !receiverAccountCategory || !accountIdentifier) {
        console.error('InstructionsPage: Missing required search parameters.', params);
        notFound(); // Redirect to a 404 page or appropriate error page
    }

    // Ensure numeric IDs are parsed correctly
    const numericAccountId = parseInt(accountId, 10);
    const numericCountryId = parseInt(countryId, 10);

    // Ensure topUpMethod is a valid enum value
    const selectedMethodValue = Object.values(TopUpMethodEnum).find(
        (method) => method === topUpMethod
    ) as TopUpMethodEnum | undefined;

    if (!selectedMethodValue) {
        console.error('InstructionsPage: Invalid topUpMethod provided in URL:', topUpMethod);
        notFound(); // Invalid method, redirect to 404
    }

    // --- 2. Fetch data (country name, addresses) on the server ---
    let selectedCountryName: string | undefined;
    let fetchedCashDepositAddresses: CashDepositAddress[] = [];
    let fetchedBankDepositAddresses: BankDepositAddress[] = [];

    try {
        // Fetch countries to get the selected country's name
        const countryPayload: FetchBackendResult<CountriesDataPayload> = await fetchBackendData<CountriesDataPayload>(
            '/kaasitoma/countries/getPriorityCountries',
            'GET',
            undefined,
            3600 // Cache for 1 hour
        );

        if (isRedirectObject(countryPayload)) {
            redirect(countryPayload.redirectTo);
        }

        selectedCountryName = countryPayload?.countries?.find(
            (c) => c.countryId === numericCountryId
        )?.countryName;

        // Conditionally fetch cash deposit addresses based on selected method
        if (selectedMethodValue === TopUpMethodEnum.CASH) {
            const cashAddressesPayload = await fetchBackendData<CashDepositAddressDataPayload>(
                `/kaasitoma/cashDepositAddresses/getCashDepositAddressesByCountryId?countryId=${numericCountryId}`,
                'GET',
                undefined,
                3600
            );

            if (isRedirectObject(cashAddressesPayload)) {
                redirect(cashAddressesPayload.redirectTo);
            }

            fetchedCashDepositAddresses = cashAddressesPayload?.cashDepositAddresses || [];


        } else if (selectedMethodValue === TopUpMethodEnum.BANK) {
            const bankAddressesPayload = await fetchBackendData<BankDepositAddressDataPayload>(
                `/kaasitoma/bankDepositAddresses/getBankDepositAddressesByCountryId?countryId=${numericCountryId}`,
                'GET',
                undefined,
                3600
            );
            if (isRedirectObject(bankAddressesPayload)) {
                redirect(bankAddressesPayload.redirectTo);
            }

            fetchedBankDepositAddresses = bankAddressesPayload?.bankDepositAddresses || [];
        }

    } catch (error) {
        console.error("InstructionsPage: Error fetching additional data:", error);
        // You might want to display a user-friendly error message or redirect
        return (
            <div className="container mx-auto p-4 text-red-600">
                <h1 className="text-2xl font-bold mb-4">{t('errorLoadingInstructions')}</h1>
                <p>{t('tryAgainMessage')}</p>
            </div>
        );
    }

    // --- 3. Define the instruction content based on the selected method ---
    // This is a mapping of enum values to JSX elements for rendering.
    // Use t() for all translatable strings.
    const topUpInstructions: Record<TopUpMethodEnum, React.ReactNode> = {
        [TopUpMethodEnum.BANK]: (
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.bankStep1Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.bankStep1Desc', { countryName: selectedCountryName || '' })}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.bankStep2Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.bankStep2Desc')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.bankStep3Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.bankStep3Desc')}</p>
                </div>
            </div>
        ),
        [TopUpMethodEnum.MOBILE_MONEY]: (
            <p className="text-gray-700 dark:text-gray-300">
                {t('InstructionsContent.mobileMoneyDesc', { mobileNumber: '123456789' })}
            </p>
        ),
        [TopUpMethodEnum.WAVE]: (
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.waveStep1Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.waveStep1Desc')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.waveStep2Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.waveStep2Desc', { accountNumber: '9999999' })}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.waveStep3Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.waveStep3Desc')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.waveStep4Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.waveStep4Desc')}</p>
                </div>
            </div>
        ),
        [TopUpMethodEnum.ORANGE_MONEY]: (
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.orangeMoneyStep1Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.orangeMoneyStep1Desc')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.orangeMoneyStep2Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.orangeMoneyStep2Desc', { accountNumber: '376385' })}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.orangeMoneyStep3Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.orangeMoneyStep3Desc')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.orangeMoneyStep4Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.orangeMoneyStep4Desc')}</p>
                </div>
            </div>
        ),
        [TopUpMethodEnum.CASH]: (
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.cashStep1Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.cashStep1Desc', { countryName: selectedCountryName || '' })}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.cashStep2Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.cashStep2Desc')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.cashStep3Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.cashStep3Desc')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.cashStep4Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.cashStep4Desc')}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('InstructionsContent.cashStep5Title')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.cashStep5Desc')}</p>
                </div>
            </div>
        ),
    };

    // --- 4. Render the component ---
    // Reconstruct the search parameters for the next page
    const nextSearchParams = new URLSearchParams({
        receiverAccountId: String(numericAccountId),
        countryId: String(numericCountryId),
        topUpMethod: selectedMethodValue,
    }).toString();

    const topUpDetailsHref = `${kaasitomaPaths.topUpDetailsPath}?${nextSearchParams}`;


    return (
        <div className="
            w-full max-w-3xl mx-auto my-8 p-6 rounded-lg shadow-xl
            bg-background/80 backdrop-blur-sm border border-border
            dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]
        ">
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                {t('pageTitle')}
            </h2>

            <CardContent className="flex-grow p-6 space-y-8">
                {/* Display method-specific instructions */}
                <Divider />
                <div
                    className="
                        p-5 bg-yellow-50 dark:bg-yellow-900/20
                        border border-yellow-200 dark:border-yellow-700
                        rounded-lg shadow-md
                    "
                >
                    <div className="text-base text-gray-800 dark:text-gray-200">
                        {topUpInstructions[selectedMethodValue] || t('InstructionsContent.selectMethodHint')}
                    </div>
                </div>

                {/* Display Cash Deposit Addresses */}
                {selectedMethodValue === TopUpMethodEnum.CASH && fetchedCashDepositAddresses.length > 0 && (
                    <>
                        <Divider />
                        <h3 className="text-xl font-semibold mb-4">
                            {t('InstructionsContent.cashAddressesHeading', { countryName: selectedCountryName || '' })}
                        </h3>
                        <ul className="space-y-3">
                            {fetchedCashDepositAddresses.map((address, index) => (
                                <li key={index} className="
                                    bg-pink-100 dark:bg-pink-900/30 p-4 rounded-lg shadow-sm
                                    flex items-center space-x-3
                                ">
                                    {/* Replace with actual PlaceIcon if available */}
                                    <span className="text-red-500">📍</span>
                                    <span className="text-gray-800 dark:text-gray-200">{address.address}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {/* Display Bank Deposit Addresses */}
                {selectedMethodValue === TopUpMethodEnum.BANK && fetchedBankDepositAddresses.length > 0 && (
                    <>
                        <Divider />
                        <h3 className="text-xl font-semibold mb-4">
                            {t('InstructionsContent.bankAddressesHeading', { countryName: selectedCountryName || '' })}
                        </h3>
                        <ul className="space-y-3">
                            {fetchedBankDepositAddresses.map((address, index) => (
                                <li key={index} className="
                                    bg-pink-100 dark:bg-pink-900/30 p-4 rounded-lg shadow-sm
                                    flex items-center space-x-3
                                ">
                                    {/* Replace with actual PlaceIcon if available */}
                                    <span className="text-red-500">🏦</span>
                                    <span className="text-gray-800 dark:text-gray-200">{address.address}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {/* The Link component now passes all searchParams to the next page */}
                <div className="text-center mt-8">
                    <Link href={topUpDetailsHref}>
                        <Button
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto`}
                        >
                            {t('continueToTopUpButton')}
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </div>
    );
}