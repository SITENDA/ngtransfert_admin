// app/[locale]/(public_pages)/oauth2/redirect/page.tsx
// This is a Server Component
import { redirect } from 'next/navigation';
import { getLocale } from "next-intl/server";
import { kaasitomaPaths } from "@/util/frontend-paths";

export const metadata = {
    title: "Processing Authentication...",
};

interface OAuth2RedirectPageProps {
    searchParams: { // Query parameters from Spring Boot redirect
        token?: string; // The access token from Spring Boot
        email?: string; // User's email from Spring Boot
        locale?: string; // Optional locale from Spring Boot
        error?: string; // Error message from Spring Boot (if any)
    };
}

export default async function OAuth2RedirectPage({ searchParams }: OAuth2RedirectPageProps) {
    const { token, email, error: springBootError, locale: localeFromSpringBoot } = await searchParams;

    // Determine the effective locale
    const paramsLocale = await getLocale();
    const currentLocale = paramsLocale || localeFromSpringBoot || 'en';

    // Determine the expected redirect path (e.g., 'kaasitoma' or 'dashboard')
    // This assumes your Spring Boot redirect already provides `ekiddako` or you have a default
    // For simplicity, if `ekiddako` is not in searchParams, we'll assume a default.
    // However, if your backend determines `ekiddako`, it should ideally pass it.
    // For now, let's pass a placeholder and assume the /api/auth/oauth2-callback will fetch the user and determine it.
    // Or, if you can get `ekiddako` from the token/email here, do so.
    // For now, let's pass the default dashboard path and let the Route Handler handle the final `ekiddako` redirect.
    const defaultRedirectPath = kaasitomaPaths.receiverAccountsPath; // e.g., 'dashboard' or 'kaasitoma'

    // Construct the URL to the new Route Handler
    const callbackUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth2-callback`);
    if (token) callbackUrl.searchParams.set('token', token);
    if (email) callbackUrl.searchParams.set('email', email);
    callbackUrl.searchParams.set('locale', currentLocale);
    if (springBootError) callbackUrl.searchParams.set('error', springBootError);
    // Pass the determined redirect path to the Route Handler
    callbackUrl.searchParams.set('ekiddakoPath', defaultRedirectPath); // Pass the path the user should go to

    console.log(`OAuth2RedirectPage: Redirecting to Route Handler: ${callbackUrl.toString()}`);
    redirect(callbackUrl.toString());

    // This part of the code should technically not be reached as `redirect` throws an error.
    return (
        <div>
            <p>Redirecting to authentication handler...</p>
        </div>
    );
}