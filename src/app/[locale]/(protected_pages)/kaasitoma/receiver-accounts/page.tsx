// src/app/[locale]/(protected_pages)/kaasitoma/receiver-accounts/page.tsx
import { getTranslations } from "next-intl/server";

import ReceiverAccountsTable from "./ReceiverAccountsTable";
import { ReceiverAccount } from "../../../../../../types/receiver-account";
import { BackendGenericResponse } from "../../../../../../types/BackendGenericResponse";
import { kaasitomaPaths } from "@/util/frontend-paths";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import ProtectedWrapper from "@/components/ProtectedWrapper";
import {cookies, headers} from "next/headers";

export default async function ReceiverAccountsPage({
                                                       searchParams,
                                                   }: {
    searchParams: Record<string, string>;
}) {
    const t = await getTranslations("ReceiverAccountsPage");

    const isFromTopUp = (await searchParams).from === "topUp";

    let receiverAccounts: ReceiverAccount[] = [];

        const headersList = await headers();
        const protocol = headersList.get("x-forwarded-proto") ?? "https";
        const host = headersList.get("host");

        if (!host) {
            throw new Error("Host header missing");
        }

    try {

        const apiUrl = `${protocol}://${host}/api/kaasitoma/receiverAccounts/getAllReceiverAccounts`;

        const cookieHeader = (await cookies())
            .getAll()
            .map(c => `${c.name}=${c.value}`)
            .join("; ");

        const response = await fetch(apiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                Cookie: cookieHeader, // 🔥 THIS FIXES IT
            },
        });


        if (!response.ok) {
            console.error("Failed to fetch receiver accounts:", response.status);
        } else {
            const data: BackendGenericResponse<{
                receiverAccounts: ReceiverAccount[];
            }> = await response.json();

            receiverAccounts = data.data?.receiverAccounts ?? [];
        }
    }
     catch (err) {
        console.error("ReceiverAccountsPage fetch error:", err);
    }

    return (
        <ProtectedWrapper>
            <div
                className="
          w-full max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-xl
          bg-background/80 backdrop-blur-sm border border-border
          dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]
        "
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                    {isFromTopUp ? t("chooseReceiverAccountTitle") : t("pageTitle")}
                </h2>

                <div className="flex justify-end mb-6">
                    <Link href={kaasitomaPaths.addReceiverAccountPath}>
                        <Button variant="outline" size="sm">
                            {t("addReceiverAccountButton")}
                        </Button>
                    </Link>
                </div>

                <ReceiverAccountsTable
                    initialReceiverAccounts={receiverAccounts}
                    isFromTopUp={isFromTopUp}
                />
            </div>
        </ProtectedWrapper>
    );
}
