// /home/amos/docure/ngtransfert_admin/src/app/[locale]/(protected_pages)/kaasitoma/page.tsx (kaasitome home page)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {getTranslations} from "next-intl/server"; // Keep getTranslations for server component
import getSession from "@/lib/getSession";
import {ClickableRow} from "@/components/ClickableRow";
import {kaasitomaPaths} from "@/util/frontend-paths";
import {fetchBackendData} from "@/lib/backend-api-client";
import {DashboardDataPayload} from "../../../../../types/dashboardContent";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Dashboard", // This could also use t('dashboardTitle') if you want
};

export default async function KaasitomaDashboardPage() {
    const t = await getTranslations('DashboardPage');
    const session = await getSession();
    const user = session!.user; // safe now

    let receiverAccountsCount = 0;
    let transferRequestsCount = 0;
    let settledTransfersCount = 0;
    let topUpRequestsCount = 0;

    try {
        // Use the refactored fetchBackendData for fetching banks
        const dashboardDataPayload = await fetchBackendData<DashboardDataPayload>(
            '/kaasitoma/getDashboardContent',
            'GET',
            undefined,
            3600
        );


        if (dashboardDataPayload && dashboardDataPayload.receiverAccountsCount >=0 && dashboardDataPayload.transferRequestsCount >=0 && dashboardDataPayload.settledTransfersCount >=0 && dashboardDataPayload.topUpRequestsCount >=0) {
            receiverAccountsCount = dashboardDataPayload.receiverAccountsCount;
            transferRequestsCount = dashboardDataPayload.transferRequestsCount;
            settledTransfersCount = dashboardDataPayload.settledTransfersCount;
            topUpRequestsCount = dashboardDataPayload.topUpRequestsCount;
            // console.log('AddReceiverAccountPage: Successfully fetched dashboard content.');
        } else {
            console.warn("AddReceiverAccountPage: No bank data fetched or data structure unexpected from backend.");
        }
    } catch (error) {
        console.error("AddReceiverAccountPage: Error during bank data fetching process:", error);
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
                        {t('welcomeMessage', { userName: user.fullName })}! {/* Use userName placeholder */}
                    </div>

                    {displayedContent}
                </CardContent>
            </Card>
        </div>
    );
}