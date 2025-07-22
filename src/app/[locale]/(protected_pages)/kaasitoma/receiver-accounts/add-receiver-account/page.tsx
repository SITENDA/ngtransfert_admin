// src/app/[locale]/(protected_pages)/kaasitoma/add-receiver-account/page.tsx

import AddReceiverAccountForm from "./AddReceiverAccountForm";
import PublicWrapper from "@/components/PublicWrapper";
import { Bank, BankDataPayload } from "../../../../../../../types/bank";
import { getLocale, getTranslations } from 'next-intl/server';
import getSession from "@/lib/getSession";
import { redirect } from 'next/navigation';
import { kaasitomaPaths } from "@/util/frontend-paths";
import { fetchBackendData } from "@/lib/backend-api-client";
import {isRedirectObject} from "@/util/typeguards";

async function AddReceiverAccountPage() {
    const t = await getTranslations('AddReceiverAccountPage');
    const locale = await getLocale();

    const session = await getSession();
    const clientId = session?.user?.userId;

    console.log("Token expiry date:", session?.user?.accessTokenExpires);

    if (!clientId) {
        console.warn(`AddReceiverAccountPage: Client ID not found after session check. Redirecting to /${locale}/${kaasitomaPaths.loginPath}`);
        redirect(`/${locale}/${kaasitomaPaths.loginPath}`);
    }

    let banks: Bank[] = [];
    const countryName = "China";

    try {
        const bankPayload = await fetchBackendData<BankDataPayload>(
            `/kaasitoma/banks/getAllBanksByCountryName?countryName=${countryName}`,
            'GET',
            undefined,
            3600
        );

        if (isRedirectObject(bankPayload)) {
            redirect(bankPayload.redirectTo);
        }

        if (bankPayload?.banks) {
            banks = bankPayload.banks;
            console.log(`AddReceiverAccountPage: Successfully fetched ${banks.length} banks for ${countryName}.`);
        } else {
            console.warn("AddReceiverAccountPage: No bank data fetched or data structure unexpected from backend.");
        }
    } catch (error) {
        console.error("AddReceiverAccountPage: Error during bank data fetching process:", error);
        banks = []; // Ensure fallback to empty array
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
                <AddReceiverAccountForm initialBanks={banks} clientId={clientId} />
            </div>
        </PublicWrapper>
    );
}

export default AddReceiverAccountPage;
