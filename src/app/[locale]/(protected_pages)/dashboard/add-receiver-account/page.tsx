// src/app/[locale]/(protected_pages)/kaasitoma/add-receiver-account/page.tsx

import AddReceiverAccountForm from "./AddReceiverAccountForm";

import { Bank, BankDataPayload } from "../../../../../../types/bank";
import { BackendGenericResponse } from "../../../../../../types/BackendGenericResponse";

import { getLocale, getTranslations } from "next-intl/server";

import getSession from "@/lib/getSession";

import { redirect } from "next/navigation";

import { kaasitomaPaths } from "@/util/frontend-paths";

import ProtectedWrapper from "@/components/ProtectedWrapper";

import { cookies, headers } from "next/headers";

async function AddReceiverAccountPage() {
    const t = await getTranslations("AddReceiverAccountPage");

    const locale = await getLocale();

    const session = await getSession();

    if (!session?.user?.userId) {
        redirect(`/${locale}/${kaasitomaPaths.loginPath}`);
    }

    const clientId = session.user.userId;

    let banks: Bank[] = [];

    try {
        const headersList = await headers();

        const protocol =
            headersList.get("x-forwarded-proto") ?? "https";

        const host = headersList.get("host");

        if (!host) {
            throw new Error("Host header missing");
        }

        const cookieHeader = (await cookies())
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; ");

        const countryName = "China";

        const apiUrl =
            `${protocol}://${host}/api/kaasitoma/banks/getAllBanksByCountryName?countryName=${encodeURIComponent(countryName)}`;

        const response = await fetch(apiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                Cookie: cookieHeader,
            },
        });

        if (!response.ok) {
            console.error(
                "Failed to fetch banks:",
                response.status
            );
        } else {
            const data: BackendGenericResponse<BankDataPayload> =
                await response.json();

            banks = data.data?.banks ?? [];
        }
    } catch (err) {
        console.error(
            "AddReceiverAccountPage fetch error:",
            err
        );
    }

    return (
        <ProtectedWrapper>
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

                <AddReceiverAccountForm
                    initialBanks={banks}
                    clientId={clientId}
                />
            </div>
        </ProtectedWrapper>
    );
}

export default AddReceiverAccountPage;