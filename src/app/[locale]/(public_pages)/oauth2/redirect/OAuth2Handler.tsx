// app/[locale]/(public_pages)/oauth2/redirect/OAuth2Handler.tsx
'use client'; // This directive is essential for client-side hooks

import { useEffect, useState } from 'react';
import {signIn, useSession} from "next-auth/react"; // Import Next-Auth's signIn for client-side
import { useAuth } from '@/context/AuthContext'; // Assuming your AuthContext for client-side state
import {useLocale, useTranslations} from 'next-intl';
import {User} from "next-auth";
import {useRouter} from "@/i18n/navigation";
import {kaasitomaPaths} from "@/util/frontend-paths"; // For translations

// Define the props that this Client Component will receive from the Server Component
interface OAuth2HandlerProps {
    token: string;        // The access token passed from page.tsx
    fetchedUser: User; // The fetched UserDTO passed from page.tsx
    locale: string;       // The determined locale passed from page.tsx
}

export default function OAuth2Handler({ token, fetchedUser, locale }: OAuth2HandlerProps) {
    const router = useRouter();
    const { login } = useAuth(); // Assuming you have a client-side AuthContext
    const t = useTranslations('LoginPage'); // Assuming you use next-intl translations
    const nextLocale = useLocale();

    const localeToUse = locale?.length > 0 ? locale : nextLocale ? nextLocale : 'en';

    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const { data: session, update } = useSession();

    useEffect(() => {
        const establishSession = async () => {
            if (!token || !fetchedUser) {
                // This scenario should ideally be caught by the Server Component,
                // but as a fallback for client-side robustness.
                setAuthError("Missing authentication data from server.");
                router.replace(`/${kaasitomaPaths.loginPath}/?error=${encodeURIComponent("Missing authentication data.")}`);
                setIsLoading(false);
                return;
            }

            try {
                // Remove localStorage token handling, as NextAuth will manage the session via HTTP-only cookies
                // localStorage.setItem('jwt_token', token); // REMOVE THIS LINE

                // console.log('Client Component: Attempting to establish Next-Auth session with fetched user:', fetchedUser);

                // --- KEY CHANGE: Call Next-Auth's signIn with fetched data ---
                // This must happen in a Client Component's useEffect or a Server Action/Route Handler
                const jwtPayload = JSON.parse(atob(token.split('.')[1]));
                const accessTokenExpires = jwtPayload.exp ? jwtPayload.exp * 1000 : undefined;

                await signIn("credentials", {
                    accessToken: token,
                    userData: JSON.stringify(fetchedUser),
                    accessTokenExpires, // ✅ OPTIONAL: Pass decoded expiry to reduce server parsing
                    redirect: false,
                });


                // 🔁 Force NextAuth to update the session
                await update({
                    ...session, // spread current session
                    user: fetchedUser, // updated user info from backend
                    accessToken: token,
                    accessTokenExpires,
                });


                router.refresh();

                // console.log('Client Component: Next-Auth session established. Redirecting to dashboard...');
                // --- Redirect the user to your main application dashboard ---
                // Use router.replace to prevent going back to this redirect page with the back button
                router.replace(`/${fetchedUser.ekiddako}`, { scroll: false });

            } catch (err: any) {
                console.error('Client Component: Error during Next-Auth session establishment:', err);
                let errorMessage = err.message || t('unexpectedError');
                // You can add more specific error handling here based on `err.message`
                if (errorMessage.includes("CredentialsSignin")) {
                    errorMessage = t('authenticationFailedCredentials'); // A more specific message
                }
                setAuthError(errorMessage);
               router.replace(`/${localeToUse}/login?error=${encodeURIComponent(errorMessage)}`);
            } finally {
                setIsLoading(false);
            }
        };

        // Execute the session establishment logic once the component mounts
        // and if necessary props are available.
        establishSession();
    }, [token, fetchedUser, localeToUse, router, login, t, update, session]); // Add all dependencies to useEffect

    if (authError) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                <h1>{t('authenticationFailed')}</h1>
                <p>{t('errorMessage')}: {authError}</p>
                <p>{t('redirectingToLogin')}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>{t('oauthProcessing')}</h1>
            <p>{t('pleaseWait')}</p>
            {isLoading && <p>Establishing user session...</p>}
            {/* You can add a spinner or loading animation here */}
        </div>
    );
}