// src/types/request-top-up.ts
import { TopUpMethodEnum } from "@/enums/TopUpMethodEnum";
import {Country} from "./country";
import {ReceiverAccount} from "./receiver-account";
import {ExchangeRate} from "./exchangeRateResult";

export interface RequestTopUpRequest {
    receiverAccountId               : number;
    amountInCNY                     : number | null; // Nullable
    destinationCurrencyCode         : string; // Destination currency code
    amountInDestinationCurrency     : number | null; // Added, Nullable
    sendingFee                      : number | null; // Nullable
    sendingFeeCurrencyCode          : number | null; // Nullable
    proofPicture                    : File | null;
    countryOfDepositId              : number; // Added
    topUpMethod                     : TopUpMethodEnum | null; // Added
}

export interface TopUpDetailsPayload {
    country: Country
    receiverAccount: ReceiverAccount;
    exchangeRate: ExchangeRate;
    sendingFeePercentage: number;
}