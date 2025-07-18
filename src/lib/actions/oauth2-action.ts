//src/lib/actions/oauth2-action.ts
'use server'; // Mark this file as a Server Action file

import { signIn } from "@/auth"; // Import the server-side signIn helper
import { redirect } from 'next/navigation';
import {UserDTO} from "../../../types/next-auth";

interface SignInPayload {
    token: string;
    userData: UserDTO;
    locale: string;
    redirectPath: string; // The path to redirect to after successful sign-in
}

export async function handleOAuthSignIn(payload: SignInPayload) {
    const { token, userData, locale, redirectPath } = payload;

    try {
        await signIn("credentials", {
            accessToken: token,
            userData: JSON.stringify(userData),
            redirect: false, // We handle the redirect
        });
        console.log("Server Action: NextAuth session established successfully.");

        // Redirect after successful sign-in.
        // It's crucial to use `redirect` from `next/navigation` here, not `NextResponse.redirect`.
        redirect(`/${locale}/${redirectPath}`, { scroll: false });

    } catch (authError: any) {
        console.error('Server Action: Error establishing NextAuth session:', authError);
        const errorMessage = authError.message || "Failed to establish user session.";
        // Redirect to login page with error
        redirect(`/${locale}/login?error=${encodeURIComponent(errorMessage)}`);
    }
}