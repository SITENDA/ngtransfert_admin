// app/[locale]/login/page.tsx
// This is a Server Component, notice no "use client"
import PublicWrapper from "@/components/PublicWrapper";
import LoginFormComponent from "@/components/LoginFormComponent"; // Import the client component
import React from 'react';
import getSession from "@/lib/getSession";
import { User } from "next-auth";
import { redirect } from 'next/navigation';
import {getLocale, getTranslations} from "next-intl/server";
import SessionResetter from "@/components/SessionResetter"; // <-- Import redirect

export const metadata = {
    title: "Login / Register | NG Transfert",
};


export default async function LoginPage() {
    const session = await getSession();
    const user: User | undefined = session?.user;
    const locale = await getLocale();
    const t = await getTranslations('Common');

    // Check if the user has a fullName AND a value for user.ekiddako
    if (user?.fullName && user?.ekiddako) {
        const redirectPath = `/${locale}/${user.ekiddako}`; // Construct the full path with locale
        redirect(redirectPath); // Perform the server-side redirect
    }

    // If the user is not authenticated, or if they are authenticated but
    // do not have both `fullName` and `ekiddako` as expected for redirection,
    // then render the login form.
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
                <SessionResetter />
                <LoginFormComponent />
            </div>
        </PublicWrapper>
    );
}