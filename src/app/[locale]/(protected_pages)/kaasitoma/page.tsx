// /home/amos/docure/ngtransfert_admin/src/app/[locale]/(protected_pages)/kaasitoma/page.tsx (kaasitoma home page)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {getLocale, getTranslations} from "next-intl/server"; // Keep getTranslations for server component
import getSession from "@/lib/getSession";
import {ClickableRow} from "@/components/ClickableRow";
import {generalPaths, kaasitomaPaths} from "@/util/frontend-paths";
import {DashboardDataPayload} from "../../../../../types/dashboardContent";
import {Link, redirect} from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cookies, headers } from "next/headers";
import {Metadata} from "next";
import {BackendHttpResponse} from "../../../../../types/BackendHttpResponse";


export const metadata: Metadata = {
    title: "Dashboard", // This could also use t('dashboardTitle') if you want
};

export default async function KaasitomaDashboardPage() {
    const t = await getTranslations('DashboardPage');
    const session = await getSession();
    const locale = await getLocale();
    if (!session || !session?.user) {
        redirect({ href: generalPaths.fromSignedOutLoginPath, locale });
        return;
    }
    const user = session?.user;

    let receiverAccountsCount = 0;
    let transferRequestsCount = 0;
    let settledTransfersCount = 0;
    let topUpRequestsCount = 0;

    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") ?? "https";
    const host = headersList.get("host");

    if (!host) {
        throw new Error("Host header missing");
    }

    const apiUrl = `${protocol}://${host}/api/kaasitoma/getDashboardContent`;

    const cookieHeader = (await cookies())
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    const response = await fetch(apiUrl, {
        method: "GET",
        cache: "no-store",
        headers: {
            Cookie: cookieHeader, // 🔥 REQUIRED
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch dashboard content:", response.status);
    } else {
        const data: BackendHttpResponse<DashboardDataPayload> =
            await response.json();

        receiverAccountsCount = data.data?.receiverAccountsCount ?? 0;
        transferRequestsCount = data.data?.transferRequestsCount ?? 0;
        settledTransfersCount = data.data?.settledTransfersCount ?? 0;
        topUpRequestsCount = data.data?.topUpRequestsCount ?? 0;
    }

    let displayedContent;

    // Fix: Wrap multiple top-level JSX elements in a Fragment or a div
    if (receiverAccountsCount === undefined || transferRequestsCount === undefined || settledTransfersCount === undefined || topUpRequestsCount === undefined) {
        displayedContent = (<>No accounts found.</>);
    } else {
        displayedContent = (
            <>
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('yourAccountsSectionTitle')}</h3>
                    <div className="space-y-3">
                        <ClickableRow href={kaasitomaPaths.receiverAccountsPath} count={receiverAccountsCount}>
                            {t('receiverAccountsLink')}
                        </ClickableRow>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('sendingRecordsSectionTitle')}</h3>
                    <div className="space-y-3">
                        <ClickableRow href={kaasitomaPaths.topUpRequestsPath} count={topUpRequestsCount} className="hover:bg-yellow-50 dark:hover:bg-yellow-900">
                            {t('topUpRequestsLink')}
                        </ClickableRow>
                        <ClickableRow href={kaasitomaPaths.transferRequestsPath} count={transferRequestsCount} className="hover:bg-pink-50 dark:hover:bg-pink-900">
                            {t('transferRequestsLink')}
                        </ClickableRow>
                        <ClickableRow href={kaasitomaPaths.settledTransfersPath} count={settledTransfersCount} className="hover:bg-purple-50 dark:hover:bg-purple-900">
                            {t('settledTransfersLink')}
                        </ClickableRow>
                        {/*<ClickableRow href={kaasitomaPaths.sendingRecordsPath} count={sendingRecordsCount} className="hover:bg-green-50 dark:hover:bg-green-900">*/}
                        {/*    {t('allSendingRecordsLink')}*/}
                        {/*</ClickableRow>*/}
                    </div>
                </section>
            </>
        );
    }


    return (
        <div className="min-h-screen  flex items-center justify-center p-4 font-sans">
            <Card className="w-full flex-grow mx-auto my-8 bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700 text-gray-900 dark:text-gray-100 flex flex-col h-full max-w-screen-lg rounded-xl shadow-lg">
                <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">{t('clientDashboardTitle')}</CardTitle>
                    <Link href={kaasitomaPaths.addReceiverAccountPath} passHref>
                        <Button variant="outline"
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            {t('addReceiverAccountButton')}
                        </Button>
                    </Link>
                </CardHeader>

                <CardContent className="flex-grow p-6 space-y-8">
                    <div className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">
                        {t('welcomeMessage', { userName: user?.fullName ?? "User" })}
                    </div>

                    {displayedContent}
                </CardContent>
            </Card>
        </div>
    );
}