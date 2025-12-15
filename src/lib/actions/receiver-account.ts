// src/lib/actions/receiver-account.ts
"use server"; // <-- IMPORTANT: This directive marks it as a Server Action

import getSession from "@/lib/getSession";
import {JWT} from "next-auth/jwt";
// You might need other imports based on what this action previously did,
// e.g., if it directly fetched from the backend before the proxy.

export async function createReceiverAccountAction(formData: FormData) {
    try {
        // 1. Get the current session on the server-side
        const session = await getSession();

        // 2. Check if the user is authenticated and if the accessToken is available
        if (!session || !session.accessToken) {
            console.error("Server Action: Authentication failed. Session or Access Token missing.");
            // Return an error object to the frontend
            return { success: false, message: "Authentication required to create a receiver account." };
        }

        const tokenObject: JWT = session.accessToken;
        const accessToken = tokenObject.accessToken;
        console.log("Server Action: Using Access Token from session:", accessToken.substring(0, 10) + '...'); // Log a snippet for debugging

        // 3. Define the URL for your Next.js API proxy route
        // This is the URL that your client-side AddReceiverAccountForm was already trying to hit.
        const proxyApiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/kaasitoma/receiverAccounts/createReceiverAccount`; // Or just "/api/..." if relative

        // 4. Make the fetch call to your Next.js API proxy, including the Authorization header
        console.log("Server Action: Forwarding request to Next.js API proxy...");
        const response = await fetch(proxyApiUrl, {
            method: 'POST',
            body: formData, // FormData is correctly passed directly
            headers: {
                // Attach the Bearer token here
                'Authorization': `Bearer ${accessToken}`,
                // The 'Content-Type' header will be automatically set to 'multipart/form-data'
                // by `fetch` when the `body` is a FormData object.
            },
            // Server Actions do not need `cache: 'no-store'` for internal API routes
            // as they directly make the request. Caching is handled by the API route itself.
        });

        // 5. Handle the response from your Next.js API proxy
        const responseData = await response.json(); // Assuming your proxy always returns JSON

        if (!response.ok) {
            // If the proxy itself returned an error (e.g., 401 from backend via proxy)
            console.error(`Server Action: API proxy returned status ${response.status}:`, responseData);
            return { success: false, message: responseData.message || responseData.error || "Failed to create account via proxy." };
        }

        console.log("Server Action: Receiver account creation successful via proxy.", responseData);
        return { success: true, message: "Receiver account created successfully!", data: responseData };

    } catch (error) {
        console.error("Server Action: Unexpected error:", error);
        return { success: false, message: "An unexpected error occurred during account creation." };
    }
}