//  src/app/[locale]/(protected_pages)/settings/page.tsx

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import {getLocale, getTranslations} from "next-intl/server"; // Keep getTranslations for server component
import getSession from "@/lib/getSession";
import {kaasitomaPaths} from "@/util/frontend-paths";

export const metadata = {
    title: "Settings", // This could also use t('dashboardTitle') if you want
};

export default async function SettingsPage() {
    const t = await getTranslations('Settings');
    const session = await getSession();
    const user = session?.user;
    const locale = await getLocale();

    if (!user) {
        redirect(`/${locale}${kaasitomaPaths.loginPath}`);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans">
            <Card className="w-full flex-grow mx-auto my-8 bg-background/80 backdrop-blur-sm border border-border dark:bg-gray-800/80 dark:border-gray-700 text-gray-900 dark:text-gray-100 flex flex-col h-full max-w-screen-lg rounded-xl shadow-lg">
                <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {t('clientDashboardTitle')}
                    </CardTitle>
                    <Link href={kaasitomaPaths.addReceiverAccountPath} passHref>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            {t('addReceiverAccountButton')}
                        </Button>
                    </Link>
                </CardHeader>

                <CardContent className="flex-grow p-6 space-y-8">
                    <div className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">
                        {t('welcomeMessage', { userName: user.fullName })}!
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}