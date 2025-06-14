// src/lib/actions/transfer-request.ts
// This is a placeholder for your actual Server Action.
// It will handle the POST request to your backend proxy for creating a transfer request.

"use server"; // This marks it as a Server Action

import { revalidatePath } from "next/cache";
import {TransferRequestSchemaType} from "@/zod-schemas/transfer-request";

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

        // The transferRequestData is already a plain object, ready to be stringified to JSON
        const requestBody = JSON.stringify(transferRequestData);

        const response = await fetch(PROXY_APPLY_TRANSFER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Important: NextAuth session handling will ensure authorization headers
                // are automatically passed from the client-side fetch, or if this were
                // called directly from a Server Component, you'd add `getSession` here.
                // For a server action, the request context usually handles this.
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
            return { success: false, message: responseBody.message || "Failed to create transfer request." };
        }
    } catch (error: any) {
        console.error("Error during transfer request creation:", error);
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
}