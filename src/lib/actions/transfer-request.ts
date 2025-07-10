// src/lib/actions/transfer-request.ts
"use server"; // This marks it as a Server Action

import { revalidatePath } from "next/cache";
import { TransferRequestSchemaType } from "@/zod-schemas/transfer-request";
import getSession from "@/lib/getSession"; // Import getSession

// Assuming your proxy for creating transfers is:
// /api/kaasitoma/transferRequests/applyForTransfer
const PROXY_APPLY_TRANSFER_URL = `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/kaasitoma/transferRequests/applyForTransfer`;

/**
 * Server Action to create a new transfer request.
 * Takes the structured TransferRequestSchemaType data and sends it to the backend proxy.
 *
 * @param {TransferRequestSchemaType} transferRequestData - The structured data containing transfer request details.
 * @returns {Promise<{ success: boolean; message: string; data?: any }>} Result of the operation.
 */
export async function createTransferRequestAction(transferRequestData: TransferRequestSchemaType) {
    const locale = 'en'; // Hardcode locale as next-intl is not available

    try {
        console.log("Server Action: Creating transfer request...");

        // --- AUTHENTICATION ADDITION START ---
        const session = await getSession();

        if (!session || !session.accessToken) {
            console.error("Server Action: Authentication failed. Session or Access Token missing for createTransferRequest.");
            return { success: false, message: "Authentication required to create transfer request." };
        }

        const accessToken = session.accessToken;
        console.log("Server Action: Using Access Token from session for transfer request:", accessToken.substring(0, 10) + '...');
        // --- AUTHENTICATION ADDITION END ---

        // The transferRequestData is already a plain object, ready to be stringified to JSON
        const requestBody = JSON.stringify(transferRequestData);

        const response = await fetch(PROXY_APPLY_TRANSFER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // Add the Authorization header here
            },
            body: requestBody,
        });

        const responseBody = await response.json();

        if (response.ok && responseBody.statusCode === 200) {
            console.log("Transfer request created successfully:", responseBody.message);
            // Optionally revalidate paths related to transfer requests list
            revalidatePath(`/${locale}/kaasitoma/transfer-requests`);
            return { success: true, message: responseBody.message, data: responseBody.data };
        } else {
            console.error("Failed to create transfer request:", responseBody.message || responseBody.developerMessage || response.statusText);
            // Log full response body for more details on error
            console.error("Full error response body:", responseBody);
            return { success: false, message: responseBody.message || "Failed to create transfer request." };
        }
    } catch (error: any) {
        console.error("Error during transfer request creation:", error);
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
}

// Your topUpAccountBalanceAction (unchanged, as it works fine)
// "use server"; // Already at the top, no need to repeat
// import getSession from "@/lib/getSession"; // Already imported at the top

export async function topUpAccountBalanceAction(formData: FormData) {
    try {
        const session = await getSession();

        if (!session || !session.accessToken) {
            console.error("Server Action: Authentication failed. Session or Access Token missing.");
            return { success: false, message: "Authentication required to details account." };
        }

        const accessToken = session.accessToken;
        console.log("Server Action: Using Access Token from session:", accessToken.substring(0, 10) + '...');

        const proxyApiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/kaasitoma/topUp/topUpAccountBalance`;

        const response = await fetch(proxyApiUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                // Content-Type is set automatically for FormData
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error(`Server Action: API proxy returned status ${response.status}:`, responseData);
            return { success: false, message: responseData.message || "Top-up failed." };
        }

        console.log("Server Action: Top-up successful via proxy.", responseData);
        return { success: true, message: "Top-up completed successfully!", data: responseData };

    } catch (error) {
        console.error("Server Action: Unexpected error:", error);
        return { success: false, message: "An unexpected error occurred during details." };
    }
}