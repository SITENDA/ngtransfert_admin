// src/app/[locale]/(protected_pages)/kaasitoma/top-up/country-and-method/page.tsx

import React from "react";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { headers } from "next/headers";

import getSession from "@/lib/getSession";
import { kaasitomaPaths } from "@/util/frontend-paths";

import { CardContent } from "@/components/ui/card";
import CountryAndMethodSelectorForm from "./CountryAndMethodSelectorForm";

import { ReceiverAccount } from "../../../../../../../types/receiver-account";
import { Country } from "../../../../../../../types/country";
import { BackendGenericResponse } from "../../../../../../../types/BackendGenericResponse";

interface CountryAndMethodSelectorPageProps {
    searchParams: Promise<{
        receiverAccountId?: string;
    }>;
}

export default async function CountryAndMethodSelectorPage({
                                                               searchParams,
                                                           }: CountryAndMethodSelectorPageProps) {
    const t = await getTranslations("CountryAndMethodSelectorPage");
    const locale = await getLocale();

    const session = await getSession();
    const clientId = session?.user?.userId;

    if (!clientId) {
        redirect(`/${locale}${kaasitomaPaths.loginPath}?ensobi=signedout`);
    }

    const receiverAccountId = (await searchParams).receiverAccountId;
    if (!receiverAccountId) {
        redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
    }

    // ✅ Build absolute internal API URLs
    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") ?? "https";
    const host = headersList.get("host");

    if (!host) {
        throw new Error("Host header missing");
    }

    const cookieHeader = headersList.get("cookie");

    const receiverAccountApiUrl =
        `${protocol}://${host}` +
        `/api/kaasitoma/receiverAccounts/getReceiverAccountById` +
        `?receiverAccountId=${receiverAccountId}`;

    const countriesApiUrl =
        `${protocol}://${host}` +
        `/api/kaasitoma/countries/getPriorityCountries`;

    let receiverAccount: ReceiverAccount | null = null;
    let countries: Country[] = [];

    try {
        // 🔐 Receiver Account (via BFF)
        const receiverAccountRes = await fetch(receiverAccountApiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                cookie: cookieHeader ?? "",
            },
        });

        if (!receiverAccountRes.ok) {
            redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
        }

        const receiverAccountData: BackendGenericResponse<{
            receiverAccount: ReceiverAccount;
        }> = await receiverAccountRes.json();

        receiverAccount = receiverAccountData.data?.receiverAccount ?? null;

        // 🌍 Countries (via BFF)
        const countriesRes = await fetch(countriesApiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                cookie: cookieHeader ?? "",
            },
        });


        if (!countriesRes.ok) {
            throw new Error("Failed to fetch countries");
        }

        const countriesData: BackendGenericResponse<{
            countries: Country[];
        }> = await countriesRes.json();

        countries = countriesData.data?.countries ?? [];
    } catch (err) {
        console.error("CountryAndMethodSelectorPage fetch error:", err);
        redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
    }

    if (!receiverAccount) {
        redirect(`/${locale}/${kaasitomaPaths.receiverAccountsPath}`);
    }

    return (
        <div
            className="
        w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
        bg-background/80 backdrop-blur-sm border border-border
        dark:bg-gray-800/80 dark:border-gray-700 min-h-[400px]
      "
        >
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                {t("pageTitle")}
            </h2>

            <CardContent className="flex-grow p-6 space-y-8">
                <CountryAndMethodSelectorForm
                    initialCountries={countries}
                    initialReceiverAccount={receiverAccount}
                />
            </CardContent>
        </div>
    );
}
