// components/LoginFormComponent.tsx
"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react'; // Import useEffect for URL param error handling
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useLocale, useTranslations } from 'next-intl'; // Import useTranslations hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the structure of the HttpResponse from your backend
interface HttpResponse<T = any> {
    status: number;
    message: string;
    data?: T; // Data field can be generic
}

// Define the expected structure for a successful login response
interface LoginSuccessData {
    token: string;
    // Add other fields if your backend returns them, e.g., userId, username
}

// Define the props for this client component
interface LoginFormComponentProps {
    // No direct props needed from server component for translations, as we use hook
}

export default function LoginFormComponent({}: LoginFormComponentProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null); // State for displaying form errors

    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('LoginPage'); // Use 'LoginPage' namespace for translations
    const searchParams = useSearchParams(); // To read error parameter from URL

    // Effect to save the current locale to localStorage
    useEffect(() => {
        if (locale) {
            localStorage.setItem('preferred_locale', locale);
            console.log(`[LoginFormComponent] Current locale '${locale}' saved to localStorage.`);
        }
    }, [locale]); // Rerun this effect if the locale changes (e.g., via a language switcher)


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
        setFormError(null); // Clear previous errors
        try {
            const response = await fetch('/api/auth/signin', { // Proxy to backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data: HttpResponse<LoginSuccessData> = await response.json();

            if (response.ok && data.status === 200 && data.message === "Successful login" && data.data?.token) {
                const jwtToken = data.data.token;
                localStorage.setItem('jwtToken', jwtToken); // Store token
                console.log("Manual login successful, token:", jwtToken);
                router.push(`/${locale}/dashboard`);
            } else {
                console.error("Manual login failed:", data.message);
                setFormError(t('loginFailed', { message: data.message || t('unknownError') }));
            }
        } catch (error: any) {
            console.error("Error during manual login:", error);
            setFormError(t('loginError', { message: error.message || t('tryAgain') }));
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

            const data: HttpResponse = await response.json();

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
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/oauth2/authorization/${provider}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-6 text-white">
                {isRegistering ? t('registerAccountTitle') : t('signInTitle')}
            </h1>

            {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">{t('errorPrefix')}: </strong>
                    <span className="block sm:inline">{formError}</span>
                </div>
            )}

            {/* Manual Form */}
            <form onSubmit={isRegistering ? handleManualRegister : handleManualLogin} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md mb-6">
                {isRegistering && (
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('usernameLabel')}:
                        </label>
                        <Input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        {t('emailLabel')}:
                    </label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        {t('passwordLabel')}:
                    </label>
                    <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <Button type="submit" className="w-full">
                    {isRegistering ? t('registerButton') : t('signInButton')}
                </Button>
            </form>

            {/* Toggle between login/register */}
            <Button variant="link" onClick={() => setIsRegistering(!isRegistering)} className="text-white mb-6">
                {isRegistering ? t('alreadyHaveAccount') : t('needAccount')}
            </Button>

            {/* OAuth2 Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
                <Button onClick={() => handleOAuth2Login('google')} className="bg-red-600 hover:bg-red-700 text-white w-full">
                    {t('loginWithGoogle')}
                </Button>
                <Button onClick={() => handleOAuth2Login('facebook')} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    {t('loginWithFacebook')}
                </Button>
            </div>
        </div>
    );
}