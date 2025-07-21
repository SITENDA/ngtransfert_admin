// app/api/auth/oauth2-callback/route.ts
import { NextRequest } from 'next/server';
import { signIn } from "@/auth"; // Import the server-side signIn helper
import { redirect } from 'next/navigation';
import {UserDTO} from "../../../../../types/next-auth"; // For server-side redirect

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const locale = searchParams.get('locale');
    const ekiddakoPath = searchParams.get('ekiddakoPath'); // New param for redirect path
    const springBootError = searchParams.get('error');

    // --- 1. Handle immediate errors from Spring Boot redirect ---
    if (springBootError) {
        console.error('OAuth2 Error from Spring Boot (via Route Handler):', springBootError);
        return redirect(`/${locale || 'en'}/login?error=${encodeURIComponent(springBootError)}`);
    }

    // --- 2. Validate essential parameters received from redirect ---
    if (!token || !email || !ekiddakoPath) { // ekiddakoPath is now essential
        console.warn('OAuth2 callback missing token, email, or redirect path.');
        return redirect(`/${locale || 'en'}/login?error=${encodeURIComponent("Authentication data missing.")}`);
    }

    let fetchedUser: UserDTO | null = null;
    try {
        // --- Fetch user data directly in this Route Handler ---
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:8443';
        const userQueryParams = new URLSearchParams({
            identifierType: 'EMAIL',
            identifierValue: email,
        }).toString();

        const response = await fetch(`${backendUrl}/kaasitoma/users/getUserByIdentifier?${userQueryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to retrieve user information from backend.');
        }

        const result = await response.json();
        fetchedUser = result.data.user as UserDTO; // Access the nested 'user' property

        if (!fetchedUser || !fetchedUser.userId || !fetchedUser.email) {
            throw new Error('User info from backend is incomplete or not in expected format.');
        }

        console.log('Route Handler: User info fetched successfully:', fetchedUser.email);

    } catch (err: any) {
        console.error('Route Handler: Error fetching user info from backend:', err);
        const fetchError = err.message || 'An unexpected error occurred during user profile retrieval.';
        return redirect(`/${locale || 'en'}/login?error=${encodeURIComponent(fetchError)}`);
    }

    // --- KEY CHANGE: Initiate NextAuth.js session within this Route Handler ---
    try {
        // This signIn call will now work as it's within a Route Handler
        await signIn("credentials", {
            accessToken: token,
            userData: JSON.stringify(fetchedUser),
            redirect: false, // We handle the redirect
        });
        console.log("Route Handler: NextAuth session established successfully.");

        // Redirect to the user's dashboard after successful session creation
        return redirect(`/${locale || 'en'}/${ekiddakoPath}`, { scroll: false });

    } catch (authError: any) {
        console.error('Route Handler: Error establishing NextAuth session:', authError);
        const errorMessage = authError.message || "Failed to establish user session.";
        return redirect(`/${locale || 'en'}/login?error=${encodeURIComponent(errorMessage)}`);
    }
}