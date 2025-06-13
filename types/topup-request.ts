// src/types/topup-request.ts

import {Currency} from "./currency";
import {ReceiverAccountCategoryType} from "@/zod-schemas/receiver-account";

/**
 * Interface for TopUp Request Data Transfer Object.
 * Corresponds to the `ResponseTopUpDTO` in the backend.
 * This structure is used for the data related to a top-up transaction.
 */
export interface TopUpRequest {
    topUpId: number;
    receiverAccountCategory: ReceiverAccountCategoryType;
    accountIdentifier: string;
    accountId: number;
    amountInCNY: number; // Using 'number' for BigDecimal, assuming frontend handles precision or it's displayed as-is
    proofPictureUrl: string;
    currency: Currency;
    // If `ResponseSendingFeeDTO` were to be included in `ResponseTopUpDTO`
    // it would be added here, e.g., `sendingFee?: SendingFeeDTO;`
}

/**
 * Specific payload structure for fetching a list of TopUp requests.
 * This would typically be used within `BackendGenericResponse<TopUpRequestsPayload>`.
 */
export interface TopUpRequestsPayload {
    topUpRequests: TopUpRequest[];
}
