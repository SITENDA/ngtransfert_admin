// app/[locale]/(public_pages)/oauth2/redirect/OAuth2Handler.tsx
'use client'; // This directive is essential for client-side hooks

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // For App Router

interface OAuth2HandlerProps {
    locale: string; // Receive locale as a prop from the Server Component
}

export default function OAuth2Handler({ locale }: OAuth2HandlerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (token) {
            // 1. Store the token securely
            localStorage.setItem('jwt_token', token);
            console.log('JWT Token received and stored.');

            // 2. Redirect the user to your main application dashboard or home page
            // Use router.replace to prevent going back to this redirect page with the back button
            // IMPORTANT: Inject the locale into the redirect URL path
            router.replace(`/${locale}/dashboard`); // E.g., /en/dashboard or /fr/dashboard

        } else if (error) {
            console.error('OAuth2 Error:', error);
            // Handle the error (e.g., display a message, redirect to login with error)
            router.replace(`/${locale}/login?error=${encodeURIComponent(error)}`);
        } else {
            // No token or error found, handle unexpected redirect
            console.warn('Unexpected OAuth2 redirect without token or error.');
            router.replace(`/${locale}/login?error=oauth_failed`); // Redirect to login, maybe with a generic error
        }
    }, [searchParams, router, locale]); // Add 'locale' to dependencies

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Processing authentication...</h1>
            <p>Please wait while we log you in.</p>
            {/* You can add a spinner or loading animation here */}
        </div>
    );
}