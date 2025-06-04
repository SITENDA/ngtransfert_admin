// components/AuthRedirector.tsx
"use client";

import { useEffect, ReactNode } from 'react'; // Import ReactNode for children prop
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

// Define props type for AuthRedirector
interface AuthRedirectorProps {
    children: ReactNode; // children can be any valid React node
}

// You'll eventually replace this with a proper AuthContext
// For now, a simple function to simulate JWT existence check
const checkJwtExistence = (): boolean => {
    // In a real app, you'd check for a JWT in localStorage, sessionStorage, or a cookie.
    // For now, we'll check for a 'token' query parameter, which is how your Spring Boot
    // OAuth2SuccessHandler sends it.
    // After parsing, you should store it securely (e.g., HttpOnly cookie is best, or localStorage for simplicity now).
    // For this mock, we always return false to allow the OAuth2 token check to proceed.
    const token = localStorage.getItem('jwtToken');
    return !!token; // Returns true if token exists, false otherwise
};

const storeToken = (token: string): void => {
    // Implement secure token storage here.
    // For development, localStorage might be used, but be aware of XSS risks.
    localStorage.setItem('jwtToken', token);
    console.log("JWT Token received (mock store):", token);
    // In a real app, you'd probably send this token to your backend to get an HttpOnly cookie,
    // or set it directly if you're managing HttpOnly cookies from the frontend.
};


export default function AuthRedirector({ children }: AuthRedirectorProps) {
    const router = useRouter();
    const locale = useLocale();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token'); // token will be string | null

        if (token) {
            // This is likely a redirect after a successful OAuth2 login
            storeToken(token); // Store the token
            console.log("OAuth2 token detected in URL. Redirecting to dashboard.");
            // Clear the token from the URL for cleaner URLs
            // Use router.replace to avoid adding the URL with token to history
            router.replace(`/${locale}/dashboard`);
            return;
        }

        // For subsequent visits, check if a token already exists (e.g., from a previous manual login or OAuth2)
        if (checkJwtExistence()) {
            console.log("Existing token found. Redirecting to dashboard.");
            router.replace(`/${locale}/dashboard`);
            return;
        }
    }, [router, locale, searchParams]); // Dependencies

    return <>{children}</>;
}