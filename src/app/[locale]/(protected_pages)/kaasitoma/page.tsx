// /home/amos/docure/ngtransfert_admin/src/app/[locale]/(protected_pages)/kaasitoma/page.tsx (kaasitome home page)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {getLocale, getTranslations} from "next-intl/server"; // Keep getTranslations for server component
import getSession from "@/lib/getSession";
import {ClickableRow} from "@/components/ClickableRow";
import {kaasitomaPaths} from "@/util/frontend-paths";
import {fetchBackendData} from "@/lib/backend-api-client";
import {DashboardDataPayload} from "../../../../../types/dashboardContent";
import {FetchBackendResult} from "../../../../../types/fetchBackendResult";

export const metadata = {
    title: "Dashboard", // This could also use t('dashboardTitle') if you want
};

export default async function KaasitomaDashboardPage() {
    const t = await getTranslations('DashboardPage');
    const session = await getSession();
    const user = session!.user; // safe now
    const locale = await getLocale();

    // console.log("Session in KaasitomaDashboardPage : ", session);


    let receiverAccountsCount = 0;
    let transferRequestsCount = 0;
    let settledTransfersCount = 0;
    let topUpRequestsCount = 0;


    try {
        const dashboardDataPayload: FetchBackendResult<DashboardDataPayload> = await fetchBackendData<DashboardDataPayload>(
            '/kaasitoma/getDashboardContent',
            'GET',
            undefined,
            3600
        );

        // console.log("DashboardDataPayload", dashboardDataPayload);

        console.log("dashboardDataPayload is : ", dashboardDataPayload);

        if (dashboardDataPayload) {
            receiverAccountsCount = dashboardDataPayload.receiverAccountsCount ?? 0;
            transferRequestsCount = dashboardDataPayload.transferRequestsCount ?? 0;
            settledTransfersCount = dashboardDataPayload.settledTransfersCount ?? 0;
            topUpRequestsCount = dashboardDataPayload.topUpRequestsCount ?? 0;
        } else {
            console.warn("Dashboard data payload is null or unsuccessful.");
        }
    } catch (error) {
        console.error("DashboardPage: Error during dashboard data fetching:", error);
    }

    const noData =
        receiverAccountsCount === 0 &&
        transferRequestsCount === 0 &&
        settledTransfersCount === 0 &&
        topUpRequestsCount === 0;

    const displayedContent = noData ? (
        <p>{t('noAccountsFoundMessage') ?? 'No accounts found.'}</p>
    ) : (
        <>
            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {t('yourAccountsSectionTitle')}
                </h3>
                <div className="space-y-3">
                    <ClickableRow href={kaasitomaPaths.receiverAccountsPath} count={receiverAccountsCount}>
                        {t('receiverAccountsLink')}
                    </ClickableRow>
                </div>
            </section>

            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {t('sendingRecordsSectionTitle')}
                </h3>
                <div className="space-y-3">
                    <ClickableRow
                        href={kaasitomaPaths.topUpRequestsPath}
                        count={topUpRequestsCount}
                        className="hover:bg-yellow-50 dark:hover:bg-yellow-900"
                    >
                        {t('topUpRequestsLink')}
                    </ClickableRow>
                    <ClickableRow
                        href={kaasitomaPaths.transferRequestsPath}
                        count={transferRequestsCount}
                        className="hover:bg-pink-50 dark:hover:bg-pink-900"
                    >
                        {t('transferRequestsLink')}
                    </ClickableRow>
                    <ClickableRow
                        href={kaasitomaPaths.settledTransfersPath}
                        count={settledTransfersCount}
                        className="hover:bg-purple-50 dark:hover:bg-purple-900"
                    >
                        {t('settledTransfersLink')}
                    </ClickableRow>
                </div>
            </section>
        </>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans">
            <Card className="w-full flex-grow mx-auto my-8 bg-background/80 backdrop-blur-sm border border-border dark:bg-gray-800/80 dark:border-gray-700 text-gray-900 dark:text-gray-100 flex flex-col h-full max-w-screen-lg rounded-xl shadow-lg">
                <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {t('clientDashboardTitle')}
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow p-6 space-y-8">
                    <div className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">
                        {t('welcomeMessage', { userName: user.fullName })}!
                    </div>
                    {displayedContent}
                </CardContent>
            </Card>
        </div>
    );
}