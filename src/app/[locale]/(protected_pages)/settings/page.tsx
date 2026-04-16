// // src/app/[locale]/(protected_pages)/settings/page.tsx
//
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { redirect } from "next/navigation";
// import { getLocale, getTranslations } from "next-intl/server";
// import getSession from "@/lib/getSession";
// import { kaasitomaPaths } from "@/util/frontend-paths";
// import SignOutButton from "@/components/SignOutButton";
// import UserDetailsCard from "@/components/UserDetailsCard";
//
// // Dynamically import UserDetailsCard as it's a client component
//
// export const metadata: Metadata = {
//     title: "Settings",
// };
//
// export default async function SettingsPage() {
//     const t = await getTranslations("Settings");
//     const session = await getSession();
//     const locale = await getLocale();
//
//     if (!session?.accessToken || !session.user) {
//         redirect(`/${locale}${kaasitomaPaths.loginPath}?ensobi=signedout`);
//     }
//
//     const user = session.user;
//     const isEmailMissing = !user.email;
//     const isPhoneMissing = !user.phoneNumber;
//     const isOAuthOnly = false;
//
//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 font-sans">
//             <Card className="w-full flex-grow mx-auto my-8 bg-background/80 backdrop-blur-sm border border-border dark:bg-gray-800/80 dark:border-gray-700 text-gray-900 dark:text-gray-100 flex flex-col h-full max-w-screen-lg rounded-xl shadow-lg">
//                 <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//                     <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">
//                         {t("settingsTitle")}
//                     </CardTitle>
//                 </CardHeader>
//
//                 <CardContent className="flex-grow p-6 space-y-6">
//                     {/* 👉 Add the user details collapsible view */}
//                     <UserDetailsCard />
//
//                     {/* Third-party login */}
//                     <div className="space-y-2">
//                         <p className="font-medium">{t("thirdPartyLogin")}</p>
//                         <Button variant="outline" size="sm">
//                             {t("addNow")}
//                         </Button>
//                     </div>
//
//                     {/* Email section (if missing) */}
//                     {isEmailMissing && (
//                         <div className="space-y-2">
//                             <p className="font-medium">{t("addEmail")}</p>
//                             <p className="text-sm text-muted-foreground">{t("emailNotSet")}</p>
//                             <Button variant="outline" size="sm">
//                                 {t("addNow")}
//                             </Button>
//                         </div>
//                     )}
//
//                     {/* Phone number section (if missing) */}
//                     {isPhoneMissing && (
//                         <div className="space-y-2">
//                             <p className="font-medium">{t("addPhoneNumber")}</p>
//                             <p className="text-sm text-muted-foreground">{t("phoneNotSet")}</p>
//                             <Button variant="outline" size="sm">
//                                 {t("addNow")}
//                             </Button>
//                         </div>
//                     )}
//
//                     {/* Password settings based on login type */}
//                     {!isOAuthOnly && (
//                         <div className="space-y-2">
//                             <p className="font-medium">{t("changePassword")}</p>
//                             <Button variant="outline" size="sm">
//                                 {t("updateNow")}
//                             </Button>
//                         </div>
//                     )}
//
//                     {isOAuthOnly && (
//                         <div className="space-y-2">
//                             <p className="font-medium">{t("addPasswordLogin")}</p>
//                             <Button variant="outline" size="sm">
//                                 {t("addNow")}
//                             </Button>
//                         </div>
//                     )}
//
//                     {/* Logout section */}
//                     <div className="pt-6 border-t border-muted">
//                         <SignOutButton variant="destructive" size="sm" color="red" />
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


// src/app/[locale]/(protected_pages)/settings/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import getSession from "@/lib/getSession";
import { kaasitomaPaths } from "@/util/frontend-paths";
import SignOutButton from "@/components/SignOutButton";
import UserDetailsCard from "@/components/UserDetailsCard";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Settings",
};

export default async function SettingsPage() {
    const t = await getTranslations("Settings");
    const locale = await getLocale();
    const session = await getSession();

    if (!session?.user) {
        redirect(`/${locale}${kaasitomaPaths.loginPath}?ensobi=signedout`);
    }

    const user = session.user;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-screen-lg bg-background/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        {t("settingsTitle")}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* ✅ PASS USER FROM SERVER */}
                    <UserDetailsCard user={user} />

                    <div className="pt-6 border-t">
                        <SignOutButton variant="destructive" size="sm" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
