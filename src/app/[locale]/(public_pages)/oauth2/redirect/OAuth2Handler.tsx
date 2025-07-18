// app/[locale]/(public_pages)/oauth2/redirect/OAuth2Handler.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
// import { useAuth } from '@/context/AuthContext'; // No longer need to import useAuth here
import { useTranslations } from 'next-intl';
import {UserDTO} from "../../../../../../types/next-auth";

interface OAuth2HandlerProps {
    token: string;
    fetchedUser: UserDTO; // Ensure this is UserDTO from your backend, not NextAuth.js User
    locale: string;
}

export default function OAuth2Handler({ token, fetchedUser, locale }: OAuth2HandlerProps) {
    const router = useRouter();
    // const { login } = useAuth(); // <<< REMOVE THIS LINE
    const t = useTranslations('LoginPage');

    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        const establishSession = async () => {
            if (!token || !fetchedUser) {
                setAuthError("Missing authentication data from server.");
                router.replace(`/${locale}/login?error=${encodeURIComponent("Missing authentication data.")}`);
                setIsLoading(false);
                return;
            }

            try {
                // This `signIn` call is what ultimately populates the NextAuth.js session
                // which your AuthContext will then react to.
                await signIn("credentials", {
                    accessToken: token,
                    userData: JSON.stringify(fetchedUser),
                    redirect: false,
                });

                // No manual `login()` call needed for AuthContext anymore!

                router.replace(`/${locale}/${fetchedUser.ekiddako}`, { scroll: false });

            } catch (err: any) {
                console.error('Client Component: Error during Next-Auth session establishment:', err);
                let errorMessage = err.message || t('unexpectedError');
                if (errorMessage.includes("CredentialsSignin")) {
                    errorMessage = t('authenticationFailedCredentials');
                }
                setAuthError(errorMessage);
                router.replace(`/${locale}/login?error=${encodeURIComponent(errorMessage)}`);
            } finally {
                setIsLoading(false);
            }
        };

        establishSession();
    }, [token, fetchedUser, locale, router, t]);

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
        </div>
    );
}