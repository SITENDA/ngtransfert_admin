import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { headers, cookies } from "next/headers";

import { BackendGenericResponse } from "../../../../../../types/BackendGenericResponse";
import TransferRequestsForm from "@/app/[locale]/(protected_pages)/kaasitoma/transfer-requests/TransferRequestsForm";
import {
    TransferRequest,
    TransferRequestsPayload
} from "../../../../../../types/transfer-requests";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";


export default async function TransferRequestsPage() {

    const t = await getTranslations("TransferRequestsPage");
    const locale = await getLocale();

    const session = await getSession();

    if (!session?.user?.userId) {
        redirect(`/${locale}/login`);
    }

    let transferRequests: TransferRequest[] = [];

    try {

        const headersList = await headers();

        const protocol =
            process.env.NODE_ENV === "development"
                ? "http"
                : headersList.get("x-forwarded-proto") ?? "https";

        const host = headersList.get("host");

        if (!host) {
            throw new Error("Host header missing");
        }

        const cookieHeader = (await cookies())
            .getAll()
            .map(c => `${c.name}=${c.value}`)
            .join("; ");

        const apiUrl =
            `${protocol}://${host}/api/kaasitoma/transferRequests/getTransferRequestsForClient`;

        const response = await fetch(apiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                Cookie: cookieHeader,
            },
        });

        if (!response.ok) {

            if (response.status === 401 || response.status === 403) {
                redirect(`/${locale}/login`);
            }

            console.error(
                "Failed to fetch transfer requests:",
                response.status
            );

        } else {

            const data:
                BackendGenericResponse<TransferRequestsPayload>
                = await response.json();

            transferRequests =
                data.data?.transferRequests ?? [];
        }

    } catch (error) {

        console.error(
            "TransferRequestsPage fetch error:",
            error
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-xl bg-background/80 backdrop-blur-sm border border-border
        dark:bg-gray-800/80 dark:border-gray-700 min-h-[800px]">

            <Card className="w-full flex-grow mx-auto my-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col h-full max-w-screen-lg rounded-xl shadow-lg">

                <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">

                    <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {t('pageTitle')}
                    </CardTitle>

                </CardHeader>

                <CardContent className="flex-grow p-6 space-y-8">

                    <TransferRequestsForm
                        initialTransferRequests={transferRequests}
                    />

                </CardContent>

            </Card>

        </div>
    );
}