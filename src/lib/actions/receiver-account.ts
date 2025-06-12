// lib/actions/receiver-account.ts
"use server"; // Essential: Marks this file as a Server Action

import { revalidatePath } from 'next/cache'; // Used to clear Next.js's data cache after a successful mutation

// Define the full URL to your Next.js API proxy endpoint.
// `process.env.NEXT_PUBLIC_APP_URL` should be configured for your deployment.
// During local development, it might be 'http://localhost:3000'.
const API_PROXY_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/kaasitoma/receiverAccounts/createReceiverAccount`;

/**
 * Server Action to create a receiver account.
 * This action receives FormData directly from the client component.
 * It then forwards this FormData to the Next.js API proxy route.
 *
 * @param formData The FormData object containing all receiver account details and the file.
 * @returns A structured object indicating success or failure, with messages and status.
 */
export async function createReceiverAccountAction(formData: FormData) {
    try {
        console.log('Server Action: Initiating call to Next.js API proxy for receiver account creation.');

        // When a Server Action makes a `fetch` call, Next.js automatically propagates
        // cookies and headers from the *original incoming client request* to the destination.
        // This means authentication tokens (like a `refreshToken` in an HttpOnly cookie)
        // will be automatically forwarded with this request to your Next.js API proxy route.
        const response = await fetch(API_PROXY_URL, {
            method: 'POST',
            body: formData, // FormData is sent directly; `fetch` handles `Content-Type` automatically.
            cache: 'no-store', // Ensures this specific request is not cached.
        });

        console.log(`Server Action: Proxy responded with HTTP status: ${response.status}`);

        // Handle responses where the proxy indicated an error (non-OK status).
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Server Action: Error received from proxy: ${response.status} - ${errorText}`);

            // Attempt to parse the error response body as JSON.
            // If parsing fails, return the raw text as the error message.
            try {
                const errorData = JSON.parse(errorText);
                return {
                    success: false,
                    message: errorData.message || 'Failed to create receiver account due to a backend error.',
                    statusCode: response.status
                };
            } catch {
                return {
                    success: false,
                    message: errorText || 'An unexpected error occurred during receiver account creation.',
                    statusCode: response.status
                };
            }
        }

        // Parse the successful JSON response from the proxy/backend.
        const responseData = await response.json();
        console.log('Server Action: Receiver account successfully processed:', responseData);

        // Revalidate the path to your receiver accounts listing page.
        // This ensures the list updates with the new account after successful creation.
        revalidatePath('/kaasitoma/receiver-accounts'); // **Adjust this path** to your actual receiver accounts list route.

        return {
            success: true,
            message: responseData.message || 'Receiver account created successfully!',
            statusCode: response.status,
            data: responseData
        };

    } catch (error) {
        // Catch any unhandled exceptions during the fetch call or processing.
        console.error('Server Action: An unhandled error occurred while creating receiver account:', error);
        return { success: false, message: 'An unhandled server error prevented receiver account creation.', statusCode: 500 };
    }
}