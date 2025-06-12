// app/[locale]/login/page.tsx
// This is a Server Component, notice no "use client"
import PublicWrapper from "@/components/PublicWrapper";
import LoginFormComponent from "@/components/LoginFormComponent"; // Import the client component
import React from 'react';
import { auth } from "@/auth";
import { User } from "next-auth";
import { redirect } from 'next/navigation'; // <-- Import redirect

export const metadata = {
    title: "Login / Register | NG Transfert",
};

interface LoginPageProps {
    // Assuming your route is app/[locale]/login/page.tsx,
    // the locale will be available in params.
    params: { locale: string };
}

export default async function LoginPage({ params }: LoginPageProps) {
    const session = await auth();
    const user: User | undefined = session?.user;

    console.log("User in login component is: ", user);

    // Check if the user has a fullName AND a value for user.ekiddako
    if (user?.fullName && user?.ekiddako) {
        const locale = params.locale; // Get the current locale from params
        const redirectPath = `/${locale}${user.ekiddako}`; // Construct the full path with locale
        console.log(`Redirecting authenticated user to: ${redirectPath}`);
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