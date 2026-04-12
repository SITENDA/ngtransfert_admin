// src/app/[locale]/(protected_pages)/kaasitoma/details-requests/details/instructions/page.tsx
// This is a Server Component.
import React from 'react';
import { notFound } from 'next/navigation';
import {getTranslations} from 'next-intl/server'; // For server component translations

import { Country } from "../../../../../../../types/country"; // Assuming this type is available
import {TopUpMethodEnum} from '@/enums/TopUpMethodEnum';
import { CashDepositAddress } from "../../../../../../../types/cashDepositAddress";
import { BankDepositAddress } from "../../../../../../../types/bankDepositAddress";
import {Button} from "@/components/ui/button";
import {kaasitomaPaths} from "@/util/frontend-paths";
import {Link} from '@/i18n/navigation';
import InstructionsClient from "@/components/InstructionsClient";
import { Separator } from "@/components/ui/separator";
import {cookies, headers} from "next/headers";
import {BackendGenericResponse} from "../../../../../../../types/BackendGenericResponse";


// --- UI Components (Simulated with HTML/Tailwind) ---


// Define the type for the query parameters expected by this page
interface InstructionsPageProps {
    searchParams: Promise<{
        accountId?: string;
        countryId?: string;
        topUpMethod?: string;
        receiverAccountCategory?: string;
        accountIdentifier?: string;
    }>;
}

export default async function InstructionsPage({ searchParams }: InstructionsPageProps) {
    const params = await searchParams;
    const t = await getTranslations('InstructionsPage'); // Use server-side translations

    const {accountId, countryId, topUpMethod, receiverAccountCategory, accountIdentifier} = params;

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
    let countries: Country[] = [];

    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") ?? "https";
    const host = headersList.get("host");

    if (!host) {
        throw new Error("Host header missing");
    }

    try {
        // Fetch countries to get the selected country's name
        const countryApiUrl = `${protocol}://${host}/api/kaasitoma/countries/getPriorityCountries`;
        const cookieHeader = (await cookies())
            .getAll()
            .map(c => `${c.name}=${c.value}`)
            .join("; ");

        const countryResponse = await fetch(countryApiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                Cookie: cookieHeader, // 🔥 THIS FIXES IT
            },
        });

        if (!countryResponse.ok) {
            console.error("Failed to fetch countries : ", countryResponse.status);
        } else {
            const data: BackendGenericResponse<{
                countries: Country[];
            }> = await countryResponse.json();

            countries = data.data?.countries ?? [];
        }

        selectedCountryName = countries?.find(
            (c) => c.countryId === numericCountryId
        )?.countryName;

        // Conditionally fetch cash deposit addresses based on selected method
        // --- Fetch deposit addresses via BFF ---
        const depositApiUrl =
            `${protocol}://${host}/api/kaasitoma/depositAddresses/getDepositAddressesByCountryId` +
            `?countryId=${numericCountryId}&type=${selectedMethodValue === TopUpMethodEnum.CASH ? "cash" : "bank"}`;

        const depositResponse = await fetch(depositApiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                Cookie: cookieHeader, // 🔥 REQUIRED for BFF session lookup
            },
        });

        if (!depositResponse.ok) {
            console.error(
                "Failed to fetch deposit addresses:",
                depositResponse.status
            );
        } else {
            const data: BackendGenericResponse<{
                cashDepositAddresses?: CashDepositAddress[];
                bankDepositAddresses?: BankDepositAddress[];
            }> = await depositResponse.json();

            if (selectedMethodValue === TopUpMethodEnum.CASH) {
                fetchedCashDepositAddresses = data.data?.cashDepositAddresses ?? [];
            } else {
                fetchedBankDepositAddresses = data.data?.bankDepositAddresses ?? [];
            }
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
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.bankStep1Desc', {countryName: selectedCountryName || ''})}</p>
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
                {t('InstructionsContent.mobileMoneyDesc', {mobileNumber: '123456789'})}
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
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.waveStep2Desc', {accountNumber: '9999999'})}</p>
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
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.orangeMoneyStep2Desc', {accountNumber: '376385'})}</p>
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
                    <p className="text-gray-700 dark:text-gray-300">{t('InstructionsContent.cashStep1Desc', {countryName: selectedCountryName || ''})}</p>
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

            <InstructionsClient>
                {/* Display method-specific instructions */}
                <div
                    className="
      p-5 bg-yellow-50 dark:bg-yellow-900/20
      border border-yellow-200 dark:border-yellow-700
      rounded-lg shadow-md
    "
                >
                    <div className="text-base text-gray-800 dark:text-gray-200">
                        {topUpInstructions[selectedMethodValue]}
                    </div>
                </div>

                {/* Cash Deposit Addresses */}
                {selectedMethodValue === TopUpMethodEnum.CASH &&
                    fetchedCashDepositAddresses.length > 0 && (
                        <>
                            <Separator className="my-6" />
                            <h3 className="text-xl font-semibold mb-4">
                                {t("InstructionsContent.cashAddressesHeading", {
                                    countryName: selectedCountryName || "",
                                })}
                            </h3>
                            <ul className="space-y-3">
                                {fetchedCashDepositAddresses.map((address, index) => (
                                    <li
                                        key={index}
                                        className="
                bg-pink-100 dark:bg-pink-900/30
                p-4 rounded-lg shadow-sm
                flex items-center space-x-3
              "
                                    >
                                        <span className="text-red-500">📍</span>
                                        <span className="text-gray-800 dark:text-gray-200">
                {address.address}
              </span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                {/* Bank Deposit Addresses */}
                {selectedMethodValue === TopUpMethodEnum.BANK &&
                    fetchedBankDepositAddresses.length > 0 && (
                        <>
                            <Separator className="my-6" />
                            <h3 className="text-xl font-semibold mb-4">
                                {t("InstructionsContent.bankAddressesHeading", {
                                    countryName: selectedCountryName || "",
                                })}
                            </h3>
                            <ul className="space-y-3">
                                {fetchedBankDepositAddresses.map((address, index) => (
                                    <li
                                        key={index}
                                        className="
                bg-pink-100 dark:bg-pink-900/30
                p-4 rounded-lg shadow-sm
                flex items-center space-x-3
              "
                                    >
                                        <span className="text-red-500">🏦</span>
                                        <span className="text-gray-800 dark:text-gray-200">
                {address.address}
              </span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                {/* Continue button */}
                <div className="text-center mt-8">
                    <Link href={topUpDetailsHref}>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">
                            {t("continueToTopUpButton")}
                        </Button>
                    </Link>
                </div>
            </InstructionsClient>

        </div>
    );
}