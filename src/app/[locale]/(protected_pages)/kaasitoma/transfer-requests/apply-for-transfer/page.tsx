// src/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/apply-for-transfer/page.tsx

import React from "react";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import getSession from "@/lib/getSession";
import { kaasitomaPaths } from "@/util/frontend-paths";
import { CardContent } from "@/components/ui/card";
import ApplyForTransferForm from "./ApplyForTransferForm";

import { Country } from "../../../../../../../types/country";
import { ReceiverAccount } from "../../../../../../../types/receiver-account";
import { BackendGenericResponse } from "../../../../../../../types/BackendGenericResponse";
import { cookies, headers } from "next/headers";

interface ApplyForTransferPageProps {
    searchParams: Promise<{
        receiverAccountId?: string;
    }>;
}

export default async function ApplyForTransferPage({
                                                       searchParams,
                                                   }: ApplyForTransferPageProps) {
    const t = await getTranslations("ApplyForTransferPage");
    const locale = await getLocale();

    const session = await getSession();
    const clientId = session?.user?.userId;

    if (!clientId) {
        redirect(`/${locale}${kaasitomaPaths.loginPath}`);
    }

    const params = await searchParams;

    const receiverAccountId = params.receiverAccountId;
    if (!receiverAccountId) {
        redirect(`/${locale}${kaasitomaPaths.receiverAccountsPath}`);
    }

    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") ?? "https";
    const host = headersList.get("host");

    if (!host) {
        throw new Error("Host header missing");
    }

    const cookieHeader = (await cookies())
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    // ✅ Declare once, with safe defaults
    let countries: Country[] = [];
    let receiverAccount: ReceiverAccount | null = null;

    try {
        // -------------------------------
        // Fetch priority countries
        // -------------------------------
        const countriesUrl = `${protocol}://${host}/api/kaasitoma/countries/getPriorityCountries`;

        const countriesRes = await fetch(countriesUrl, {
            method: "GET",
            cache: "no-store",
            headers: { Cookie: cookieHeader },
        });

        if (countriesRes.ok) {
            const data: BackendGenericResponse<{ countries: Country[] }> =
                await countriesRes.json();
            countries = data.data?.countries ?? [];
        }

        // -------------------------------
        // Fetch receiver account
        // -------------------------------
        const receiverAccountUrl =
            `${protocol}://${host}/api/kaasitoma/receiverAccounts/getReceiverAccountById` +
            `?receiverAccountId=${receiverAccountId}`;

        const receiverRes = await fetch(receiverAccountUrl, {
            method: "GET",
            cache: "no-store",
            headers: { Cookie: cookieHeader },
        });

        if (receiverRes.ok) {
            const data: BackendGenericResponse<{ receiverAccount: ReceiverAccount }> =
                await receiverRes.json();
            receiverAccount = data.data?.receiverAccount ?? null;
        }
    } catch (error) {
        console.error(
            "ApplyForTransferPage: data fetch failed:",
            error
        );
    }

    return (
        <div
            className="
                w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]
            "
        >
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                {t("pageTitle")}
            </h2>

            <CardContent className="flex-grow p-6 space-y-8">
                {
                    receiverAccount &&
                    <ApplyForTransferForm
                    initialCountries={countries}
                    clientId={clientId}
                    receiverAccount={receiverAccount}
                />
                }
            </CardContent>
        </div>
    );
}
