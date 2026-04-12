// // app/(localized)/[locale]/(public_pages)/oauth2/redirect/page.tsx
// // This is a Server Component
// import { redirect } from 'next/navigation';
// import OAuth2Handler from "@/app/[locale]/(public_pages)/oauth2/redirect/OAuth2Handler";
// import {User} from "next-auth";
// import {getLocale} from "next-intl/server";
//
// export const metadata = {
//     title: "Processing Authentication...",
// };
//
// interface OAuth2RedirectPageProps {
//     searchParams: { // Query parameters from Spring Boot redirect
//         token?: string; // The access token from Spring Boot
//         email?: string; // User's email from Spring Boot
//         locale?: string; // Optional locale from Spring Boot
//         error?: string; // Error message from Spring Boot (if any)
//     };
// }
//
// export default async function OAuth2RedirectPage({ searchParams }: OAuth2RedirectPageProps) {
//     const { token, email, error: springBootError, locale: localeFromSpringBoot } = await searchParams;
//
//     // Determine the effective locale using path params first, then Spring Boot's locale, then default to 'en'
//
//     const paramsLocale = await getLocale();
//
//     const currentLocale = paramsLocale || localeFromSpringBoot || 'en';
//
//     // --- 1. Handle immediate errors from Spring Boot redirect ---
//     if (springBootError) {
//         console.error('OAuth2 Error from Spring Boot:', springBootError);
//         // Server-side redirect to login page with the error message
//         redirect(`/${currentLocale}/login?error=${encodeURIComponent(springBootError)}`);
//     }
//
//     // --- 2. Validate essential parameters received from redirect ---
//     if (!token || !email) {
//         console.warn('OAuth2 redirect missing token or email.');
//         // Server-side redirect for missing essential authentication data
//         redirect(`/${currentLocale}/login?error=${encodeURIComponent("Authentication data missing.")}`);
//     }
//
//     let fetchedUser: User | null = null;
//     let fetchError: string | null = null;
//
//     try {
//         // --- THIS IS THE KEY CHANGE: Fetch user data directly in the Server Component ---
//         const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
//         const userQueryParams = new URLSearchParams({
//             identifierType: 'EMAIL', // Assuming 'EMAIL' is a valid UserIdentifier type
//             identifierValue: email,
//         }).toString();
//
//         const response = await fetch(`${backendUrl}/kaasitoma/users/getUserByIdentifier?${userQueryParams}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`, // Authenticate with the access token
//             },
//             cache: 'no-store', // Ensures the fetch is always fresh and not cached by Next.js
//         });
//
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Failed to retrieve user information from backend.');
//         }
//
//         const result = await response.json();
//         fetchedUser = result.data.user as User; // Assuming HttpResponse nests user under 'data.user'
//
//         if (!fetchedUser || !fetchedUser.userId || !fetchedUser.email) {
//             throw new Error('User info from backend is incomplete or not in expected format.');
//         }
//
//         // console.log('Server Component: User info fetched successfully:', fetchedUser);
//
//     } catch (err: any) {
//         console.error('Server Component: Error fetching user info from backend:', err);
//         fetchError = err.message || 'An unexpected error occurred during user profile retrieval.';
//         // If there's an error during fetch, redirect back to login
//         redirect(`/${currentLocale}/login?error=${encodeURIComponent(fetchError)}`);
//     }
//
//     // Pass the fetched data to the Client Component
//     return (
//         <OAuth2Handler
//             token={token}
//             fetchedUser={fetchedUser}
//             locale={currentLocale}
//         />
//     );
// }







// ✅ SERVER COMPONENT ONLY

import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { saveSession } from "@/lib/sessionStore";
import { setSessionCookie } from "@/lib/cookies";
import { getLocale } from "next-intl/server";

export const metadata = {
    title: "Signing you in...",
};

interface OAuthRedirectPageProps {
    searchParams: Promise<{
        accessToken?: string;
        refreshToken?: string;
        error?: string;
    }>;
}

export default async function OAuthRedirectPage({
                                                    searchParams,
                                                }: OAuthRedirectPageProps) {
    const locale = await getLocale();
    const params = await searchParams;

    const { accessToken, refreshToken, error } = params;

    if (error) {
        redirect(`/${locale}/login?error=${encodeURIComponent(error)}`);
    }

    if (!accessToken || !refreshToken) {
        redirect(`/${locale}/login?error=oauth_failed`);
    }

    const meRes = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    if (!meRes.ok) {
        redirect(`/${locale}/login?error=oauth_failed`);
    }

    const user = await meRes.json();

    const sessionId = randomUUID();

    await saveSession(sessionId, {
        user,
        accessToken,
        refreshToken,
        accessTokenExpiresAt: Date.now() + 5 * 60 * 1000,
    });

    await setSessionCookie(sessionId);

    redirect(`/${locale}/${user.ekiddako}`);
}