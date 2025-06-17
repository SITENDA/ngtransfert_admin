// src/types/request-top-up.ts
import { ReceiverAccountCategoryType } from "@/zod-schemas/receiver-account";
import { TopUpMethodEnum } from "@/enums/TopUpMethodEnum"; // Ensure path is correct

export interface RequestTopUp {
    receiverAccountCategory: ReceiverAccountCategoryType;
    accountIdentifier: string;
    accountId: number;
    countryOfDepositId: number; // Added
    topUpMethod: TopUpMethodEnum | null; // Added
    currency: string; // Destination currency code
    amountInCNY: number | null; // Nullable
    amountInDestinationCurrency: number | null; // Added, Nullable
    sendingFee: number | null; // Nullable
    proofPicture: File | null;
}