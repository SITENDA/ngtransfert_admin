// src/types/transfer-request.ts

// Assuming ReceiverAccountCategoryType is defined elsewhere and imported,
// for instance, from a Zod schema or a direct type definition.
// import { ReceiverAccountCategoryType } from "@/zod-schemas/receiver-account"; // Or from your general types file
// If not already defined, ensure it's available, e.g.:
/**
 * Interface for a Transfer Request.
 * Corresponds to the `RequestTransferRequestDTO` in your backend.
 */

export interface TransferRequest {
    clientId: number;
    receiverAccountId: number;
    countryOfDepositId: number;
    currencyCode: string;
    amount: number;
    rate: number;
    remark: string;
}

/**
 * Specific payload structure for fetching a list of Transfer Requests.
 * This would typically be used within `BackendGenericResponse<TransferRequestsPayload>`.
 */
export interface TransferRequestsPayload {
    transferRequests: TransferRequest[];
}
