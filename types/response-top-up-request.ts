// src/types/response-top-up-request.ts

import {Currency} from "./currency";
import {TopUpMethodEnum} from "@/enums/TopUpMethodEnum";
import { Country } from "./country";

/**
 * Interface for TopUp Request Data Transfer Object.
 * Corresponds to the `ResponseTopUpDTO` in the backend.
 * This structure is used for the data related to a details transaction.
 */
export interface ResponseTopUpRequest {
    topUpId                     : number;
    receiverAccountId           : number;
    amountInCNY                 : number;
    destinationCurrency         : Currency;
    amountInDestinationCurrency : number;
    sendingFee                  : number;
    sendingFeeCurrency          : Currency;
    proofPictureUrl             : string;
    countryOfDeposit            : Country;
    topUpMethod                 : TopUpMethodEnum;
    isApproved                  : boolean;
}

/**
 * Specific payload structure for fetching a list of TopUp requests.
 * This would typically be used within `BackendGenericResponse<TopUpRequestsPayload>`.
 */
export interface TopUpRequestsPayload {
    topUpRequests: ResponseTopUpRequest[];
}