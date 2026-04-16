// src/app/[locale]/(protected_pages)/kaasitoma/details/page.tsx

import React from "react";
import {redirect} from "next/navigation";
import {cookies, headers} from "next/headers";
import {getTranslations} from "next-intl/server";

import ProtectedWrapper from "@/components/ProtectedWrapper";
import {Button} from "@/components/ui/button";
import {CardHeader} from "@/components/ui/card";
import CategoryIcon from "@/components/CategoryIcon";
import CountryFlag from "@/components/CountryFlag";
import ImageDisplay from "@/components/ImageDisplay";
import EmailDisplay from "@/components/EmailDisplay";
import PhoneNumberDisplay from "@/components/PhoneNumberDisplay";

import {Link} from "@/i18n/navigation";
import {kaasitomaPaths} from "@/util/frontend-paths";

import {ReceiverAccount} from "../../../../../../../types/receiver-account";
import {BackendGenericResponse} from "../../../../../../../types/BackendGenericResponse";

interface DetailRowProps {
    label: string;
    value?: React.ReactNode;
    children?: React.ReactNode;
}

export default async function ReceiverAccountDetailsPage({
                                                             searchParams,
                                                         }: {
    searchParams: Promise<{ receiverAccountId?: string }>;
}) {
    const t = await getTranslations("ReceiverAccountDetailsPage");

    const receiverAccountId = (await searchParams).receiverAccountId;
    if (!receiverAccountId) {
        redirect(kaasitomaPaths.receiverAccountsPath);
    }

    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") ?? "https";
    const host = headersList.get("host");

    if (!host) {
        throw new Error("Host header missing");
    }

    const apiUrl =
        `${protocol}://${host}` +
        `/api/kaasitoma/receiverAccounts/getReceiverAccountById` +
        `?receiverAccountId=${receiverAccountId}`;

    let receiverAccount: ReceiverAccount | null = null;

    try {
        const cookieHeader = (await cookies())
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; ");

        const response = await fetch(apiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                Cookie: cookieHeader,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch receiver account:", response.status);
            receiverAccount = null;
        } else {
            const data: BackendGenericResponse<{ receiverAccount: ReceiverAccount }> =
                await response.json();

            receiverAccount = data.data?.receiverAccount ?? null;
        }
    } catch (err) {
        console.error("ReceiverAccountDetailsPage fetch error:", err);
        receiverAccount = null;
    }

    // ⛔ HARD STOP — JSX BELOW NEVER RUNS WITHOUT DATA
    if (!receiverAccount) {
        return (
            <ProtectedWrapper>
                <div className="w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                        bg-background/80 backdrop-blur-sm border border-border
                        dark:bg-gray-800/80 dark:border-gray-700
                        min-h-[400px] flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-center text-red-500">
                        {t("errorLoadingAccountDetails")}
                    </h2>
                </div>
            </ProtectedWrapper>
        );
    }

    // ✅ SAFE: receiverAccount is guaranteed from here onward

    return (
        <ProtectedWrapper>
            <div className="w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                      bg-background/80 backdrop-blur-sm border border-border
                      dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]">

                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                    {t("pageTitle")}
                </h2>

                <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b">
                    <Link href={`${kaasitomaPaths.topUpCountryAndMethodPath}${receiverAccountId}`}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Top Up
                        </Button>
                    </Link>

                    <Link href={`${kaasitomaPaths.applyForTransferPath}${receiverAccountId}`}>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Request for Transfer
                        </Button>
                    </Link>
                </CardHeader>

                <section className="mt-6 space-y-6">

                    <Section title={t("generalDetails")}>
                        <DetailRow label={t("receiverAccountCategory")}>
                            <div className="flex items-center gap-2">
                                <CategoryIcon category={receiverAccount.receiverAccountCategory}/>
                                <span>{t(receiverAccount.receiverAccountCategory.toLowerCase())}</span>
                            </div>
                        </DetailRow>

                        <DetailRow label={t("receiverAccountName")} value={receiverAccount.receiverAccountName}/>
                        <DetailRow label={t("receiverAccountIdentifier")}
                                   value={t(receiverAccount.receiverAccountIdentifier.toLowerCase())}/>

                        {receiverAccount.qrCodeUrl && (
                            <DetailRow label={t("qrCodeImage")}>
                                <ImageDisplay imageUrl={receiverAccount.qrCodeUrl} title="QR Code"/>
                            </DetailRow>
                        )}

                        {receiverAccount.email && !receiverAccount.email.startsWith("rand") && (
                            <DetailRow label={t("email")}>
                                <EmailDisplay email={receiverAccount.email}/>
                            </DetailRow>
                        )}

                        {receiverAccount.phoneNumber && !receiverAccount.phoneNumber.startsWith("rand") && (
                            <DetailRow label={t("phoneNumber")}>
                                <PhoneNumberDisplay phoneNumber={receiverAccount.phoneNumber}/>
                            </DetailRow>
                        )}
                    </Section>

                    <Section title={t("accountLimits")}>
                        <DetailRow label={t("accountBalance")}>
                            {receiverAccount.balance.toLocaleString()}{" "}
                            {receiverAccount.currency?.currencyCode}
                        </DetailRow>

                        {receiverAccount.limit !== undefined && (
                            <DetailRow label={t("accountLimit")}>
                                {receiverAccount.limit.toLocaleString()}{" "}
                                {receiverAccount.limitCurrency?.currencyCode}
                            </DetailRow>
                        )}
                    </Section>

                    {receiverAccount.receiverAccountCategory === "BANK_ACCOUNT" && (
                        <Section title={t("bankDetails")}>
                            {receiverAccount.bankAccountNumber && (
                                <DetailRow label={t("bankAccountNumber")}
                                           value={receiverAccount.bankAccountNumber}/>
                            )}

                            {receiverAccount.cardHolderName && (
                                <DetailRow label={t("cardHolderName")}
                                           value={receiverAccount.cardHolderName}/>
                            )}

                            {receiverAccount.bank?.bankName && (
                                <DetailRow label={t("bankName")}
                                           value={receiverAccount.bank.bankName}/>
                            )}

                            {receiverAccount.bank?.country && (
                                <DetailRow label={t("bankCountry")}>
                  <span className="flex items-center gap-2">
                    {receiverAccount.bank.country.countryName}
                      {receiverAccount.bank.country.countryFlagUrl && (
                          <CountryFlag
                              flagUrl={receiverAccount.bank.country.countryFlagUrl}
                              alt={receiverAccount.bank.country.countryName}
                          />
                      )}
                  </span>
                                </DetailRow>
                            )}
                        </Section>
                    )}
                </section>
            </div>
        </ProtectedWrapper>
    );
}

/* ---------------------------------- */

function Section({
                     title,
                     children,
                 }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="p-6 rounded-lg shadow-inner bg-background-light dark:bg-gray-700/50 border">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            {children}
        </section>
    );
}

const DetailRow: React.FC<DetailRowProps> = async ({label, value, children}) => {
    const t = await getTranslations("ReceiverAccountDetailsPage");

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] py-3 border-b last:border-b-0">
            <div className="text-muted-foreground font-medium sm:text-right sm:pr-6">
                {label}:
            </div>

            {/* 👇 KEY FIX */}
            <div className="flex justify-end items-center text-foreground">
                {value ?? children ?? t("notApplicable")}
            </div>
        </div>
    );
};