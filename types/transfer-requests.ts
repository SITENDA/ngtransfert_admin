// src/types/transfer-request.ts

// Assuming ReceiverAccountCategoryType is defined elsewhere and imported,
// for instance, from a Zod schema or a direct type definition.
// import { ReceiverAccountCategoryType } from "@/zod-schemas/receiver-account"; // Or from your general types file
// If not already defined, ensure it's available, e.g.:
import {ReceiverAccountCategoryType} from "@/zod-schemas/receiver-account";

/**
 * Interface for a Transfer Request.
 * Corresponds to the `RequestTransferRequestDTO` in your backend.
 */
export interface TransferRequest {
    amount: number;             // Corresponds to Double amount
    currencyId: number;         // Corresponds to Long currencyId
    rate: number;               // Corresponds to BigDecimal rate
    remark: string;
    receiverAccountCategory: ReceiverAccountCategoryType; // Corresponds to ReceiverAccountCategory enum
    receiverAccountId: number;  // Corresponds to Long receiverAccountId
    clientId: number;           // Corresponds to Long clientId
    countryOfDepositId: number; // Corresponds to Long countryOfDepositId
}

/**
 * Specific payload structure for fetching a list of Transfer Requests.
 * This would typically be used within `BackendGenericResponse<TransferRequestsPayload>`.
 */
export interface TransferRequestsPayload {
    transferRequests: TransferRequest[];
}
