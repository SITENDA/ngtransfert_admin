// components/LoginFormComponent.tsx
"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {signIn, useSession} from "next-auth/react";
import {kaasitomaPaths} from "@/util/frontend-paths";
import {useRouter} from "@/i18n/navigation";

// Define the props for this client component
type LoginFormComponentProps = object

export default function LoginFormComponent({}: LoginFormComponentProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null); // State for displaying form errors
    // State for input type
    const [loginWithPhone, setLoginWithPhone] = useState<boolean>(false);
    const { data: session, status } = useSession();


    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('LoginPage'); // Use 'LoginPage' namespace for translations
    const searchParams = useSearchParams(); // To read error parameter from URL

    // Effect to save the current locale to localStorage
    useEffect(() => {
        if (locale) {
            localStorage.setItem('preferred_locale', locale);
            // console.log(`[LoginFormComponent] Current locale '${locale}' saved to localStorage.`);
        }
    }, [locale]);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.ekiddako && session?.accessToken != null) {
            router.replace(`/${session.user.ekiddako}`, { scroll: false });
        }
    }, [status, session, router]);

    // Effect to check for OAuth2 errors in URL parameters
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            // Display a generic error message or translate specific error codes
            console.error("OAuth2 Error from backend:", errorParam);
            setFormError(t('oauthError')); // Use a translation key for the error message
            // Optionally remove the error param from the URL
            const newSearchParams = new URLSearchParams(searchParams.toString());
            newSearchParams.delete('error');
            router.replace(`/${locale}/login?${newSearchParams.toString()}`, { scroll: false });
        }
    }, [searchParams, t, router, locale]);

    const handleManualLogin = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);

        const identifier = loginWithPhone ? "phoneNumber" : "email";
        const payload = {
            identifier,
            email: loginWithPhone ? '' : email,
            phoneNumber: loginWithPhone ? phoneNumber : '',
            password
        };

        const result = await signIn("credentials", {
            redirect: false,
            ...payload
        });

        console.log("Result from backend :", result);

        if (result?.ok) {
            if (status === "authenticated" && session?.user?.ekiddako) {
                router.replace(`/${session.user.ekiddako}`, { scroll: false });
            }
            router.push(kaasitomaPaths.homePath);

        } else {
            setFormError(t('loginFailed', { message: result?.error || t('unknownError') }));
        }
    };


    const handleManualRegister = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null); // Clear previous errors
        try {
            const response = await fetch('/api/auth/register', { // Proxy to backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok && data.status === 200 && data.message === "User registered successfully") {
                console.log("Manual registration successful:", data.message);
                alert(t('registrationSuccess')); // Use translated alert
                setIsRegistering(false); // Switch back to login form
            } else {
                console.error("Manual registration failed:", data.message);
                setFormError(t('registrationFailed', { message: data.message || t('unknownError') }));
            }
        } catch (error: any) {
            console.error("Error during manual registration:", error);
            setFormError(t('registrationError', { message: error.message || t('tryAgain') }));
        }
    };

    const handleOAuth2Login = (provider: string): void => {
        const redirectUri = `${window.location.origin}/${locale}/oauth2/redirect`;
        const oauth2Url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/oauth2/authorization/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
        window.location.href = oauth2Url;
    };


    return (
        // Outer div for the entire page background (can be handled by a layout component)
        <div className="flex flex-col items-center justify-center p-4">
            {/* Inner div for the transparent, rounded content container */}
            <div className="
                w-full max-w-sm mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700
                flex flex-col items-center justify-center
            ">
                {formError && (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4 w-full">
                        <strong className="font-bold">{t('errorPrefix')}: </strong>
                        <span className="block sm:inline">{formError}</span>
                    </div>
                )}

                {/* Manual Form - Removed its own background and shadow as parent div handles it */}
                <form onSubmit={isRegistering ? handleManualRegister : handleManualLogin} className="w-full mb-6">
                    {isRegistering && (
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                                {t('usernameLabel')}:
                            </label>
                            <Input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                required
                                className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor={loginWithPhone ? "phoneNumber" : "email"} className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                            {loginWithPhone ? t('phoneNumberLabel') : t('emailLabel')}:
                        </label>
                        <Input
                            type={loginWithPhone ? "tel" : "email"}
                            id={loginWithPhone ? "phoneNumber" : "email"}
                            value={loginWithPhone ? phoneNumber : email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                loginWithPhone ? setPhoneNumber(e.target.value) : setEmail(e.target.value)
                            }
                            required
                            className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800"
                        />
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                        <button
                            type="button"
                            onClick={() => setLoginWithPhone(prev => !prev)}
                            className="hover:underline focus:outline-none"
                        >
                            {t('loginWith')} {loginWithPhone ? t('emailLabel').toLowerCase() : t('phoneNumberLabel').toLowerCase()}
                        </button>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                            {t('passwordLabel')}:
                        </label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                            className="shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                        {isRegistering ? t('registerButton') : t('signInButton')}
                    </Button>
                </form>

                {/* Toggle between login/register */}
                <Button variant="link" onClick={() => setIsRegistering(!isRegistering)} className="text-blue-600 dark:text-blue-400 mb-6 hover:underline">
                    {isRegistering ? t('alreadyHaveAccount') : t('needAccount')}
                </Button>

                {/* OAuth2 Buttons */}
                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <Button onClick={() => handleOAuth2Login('google')} className="bg-red-600 hover:bg-red-700 text-white w-full dark:bg-red-700 dark:hover:bg-red-800">
                        {t('loginWithGoogle')}
                    </Button>
                    <Button onClick={() => handleOAuth2Login('facebook')} className="bg-blue-600 hover:bg-blue-700 text-white w-full dark:bg-blue-700 dark:hover:bg-blue-800">
                        {t('loginWithFacebook')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
