// src/app/[locale]/(protected_pages)/kaasitoma/top-up/page.tsx

import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { headers, cookies } from "next/headers";

import ProtectedWrapper from "@/components/ProtectedWrapper";
import { BackendGenericResponse } from "../../../../../../../types/BackendGenericResponse";
import { ResponseTopUpRequest, TopUpRequestsPayload } from "../../../../../../../types/response-top-up-request";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { kaasitomaPaths } from "@/util/frontend-paths";
import TopUpRequestsTable from "@/app/[locale]/(protected_pages)/kaasitoma/top-up/(requests)/TopUpRequestsTable";

export default async function TopUpRequestsPage() {
    const t = await getTranslations("TopUpRequestsPage");
    const locale = await getLocale();

    // 🔐 Session guard
    const session = await getSession();
    if (!session?.user?.userId) {
        redirect(`/${locale}/login`);
    }

    let topUpRequests: ResponseTopUpRequest[] = [];

    try {
        const headersList = await headers();
        const protocol = headersList.get("x-forwarded-proto") ?? "https";
        const host = headersList.get("host");
        if (!host) throw new Error("Host header missing");

        const cookieHeader = (await cookies())
            .getAll()
            .map(c => `${c.name}=${c.value}`)
            .join("; ");

        const apiUrl = `${protocol}://${host}/api/kaasitoma/topUp/getAllTopUpRequests`;

        const response = await fetch(apiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                Cookie: cookieHeader, // 🔥 REQUIRED
            },
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                redirect(`/${locale}/login`);
            }
            console.error("Failed to fetch top-up requests:", response.status);
        } else {
            const data: BackendGenericResponse<TopUpRequestsPayload> =
                await response.json();

            topUpRequests = data.data?.topUpRequests ?? [];
        }
    } catch (err) {
        console.error("TopUpRequestsPage fetch error:", err);
    }

    return (
        <ProtectedWrapper>
            <div className="
                w-full max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]
            ">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                    {t("pageTitle")}
                </h2>

                <div className="flex justify-end mb-6">
                    <Link href={`${kaasitomaPaths.receiverAccountsPath}?from=topUp`}>
                        <Button variant="outline" size="sm">
                            {t("topUp")}
                        </Button>
                    </Link>
                </div>

                <TopUpRequestsTable initialTopUpRequests={topUpRequests} />
            </div>
        </ProtectedWrapper>
    );
}
