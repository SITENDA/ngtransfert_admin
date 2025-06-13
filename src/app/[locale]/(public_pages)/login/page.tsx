// app/[locale]/login/page.tsx
// This is a Server Component, notice no "use client"
import PublicWrapper from "@/components/PublicWrapper";
import LoginFormComponent from "@/components/LoginFormComponent"; // Import the client component
import React from 'react';
import getSession from "@/lib/getSession";
import { User } from "next-auth";
import { redirect } from 'next/navigation';
import {getLocale} from "next-intl/server"; // <-- Import redirect

export const metadata = {
    title: "Login / Register | NG Transfert",
};


export default async function LoginPage() {
    const session = await getSession();
    const user: User | undefined = session?.user;
    const locale = getLocale();

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
            <LoginFormComponent />
        </PublicWrapper>
    );
}