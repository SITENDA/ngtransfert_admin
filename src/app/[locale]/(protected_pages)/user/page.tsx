//  src/app/[locale]/(protected_pages)/user/page.tsx

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import getSession from "@/lib/getSession";
import {generalPaths, kaasitomaPaths} from "@/util/frontend-paths";
import ProfileImageChanger from "@/components/ProfileImageChanger";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "User Profile",
};

export default async function UserProfilePage() {
    const t = await getTranslations("UserProfile");
    const session = await getSession();
    const user = session?.user;
    const locale = await getLocale();

    if (!user) {
        redirect(`/${locale}${kaasitomaPaths.loginPath}?ensobi=signedout`);
    }

    // const formattedDate = new Date(user.registrationDate).toLocaleDateString(locale, {
    //     year: "numeric",
    //     month: "long",
    //     day: "numeric",
    // });

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans">
            <Card className="w-full max-w-3xl bg-background/80 backdrop-blur-sm border border-border dark:bg-gray-800/80 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 gap-4">
                    <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {t("yourProfile")}
                    </CardTitle>
                    <Link href={generalPaths.settingsPath} passHref>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            {t("editSettings")}
                        </Button>
                    </Link>
                </CardHeader>

                <CardContent className="flex flex-col md:flex-row gap-8 p-6">
                    <ProfileImageChanger profileImageUrl={user.profileImageUrl ?? "/default-avatar.png"} />

                    <div className="flex-grow space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">{t("fullName")}</p>
                            <p className="text-lg font-medium">{user.fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{t("username")}</p>
                            <p className="text-lg font-medium">{user.username}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{t("email")}</p>
                            <p className="text-lg font-medium">{user.email}</p>
                        </div>
                        {/*<div>*/}
                        {/*    <p className="text-sm text-muted-foreground">{t("registeredOn")}</p>*/}
                        {/*    <p className="text-lg font-medium">{formattedDate}</p>*/}
                        {/*</div>*/}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
