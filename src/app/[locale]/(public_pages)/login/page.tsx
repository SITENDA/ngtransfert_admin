// app/[locale]/login/page.tsx
// This is a Server Component, notice no "use client"
// This is a Server Component
import PublicWrapper from "@/components/PublicWrapper";
import LoginFormComponent from "@/components/LoginFormComponent";
import React from 'react';
import getSession from "@/lib/getSession";
import { User } from "next-auth";
import { redirect } from 'next/navigation';
import { getLocale, getTranslations } from "next-intl/server";
import SessionResetter from "@/components/SessionResetter";
import ForceSignOutHandler from "@/components/ForceSignOutHandler";

export const metadata = {
    title: "Login / Register | NG Transfert",
};

export default async function LoginPage({
                                            searchParams,
                                        }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const locale = await getLocale();
    const t = await getTranslations('Common');
    const searchParamsToUse = await searchParams;

    const shouldForceSignOut =
        searchParamsToUse?.ensobi === "signedout" ||
        searchParamsToUse?.forceSignOut === "true";

    const session = await getSession();
    const user: User | undefined = session?.user;

    // ✅ Only redirect if user is authenticated and NOT in forced sign-out mode
    if (!shouldForceSignOut && user?.fullName && user?.ekiddako) {
        const redirectPath = `/${locale}/${user.ekiddako}`;
        redirect(redirectPath);
    }

    return (
        <PublicWrapper>
            <div className="
                w-full max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700
            ">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                    {t('login')}
                </h2>

                {/* Will call signOut() client-side if needed */}
                {shouldForceSignOut && <ForceSignOutHandler />}
                <SessionResetter />
                <LoginFormComponent />
            </div>
        </PublicWrapper>
    );
}
