// src/types/receiver-account.ts

// Adjust this based on your actual Spring Boot ReceiverAccount DTO structure
import {Bank} from "./bank";
import {Country} from "./country";

export interface ReceiverAccount {
    receiverAccountId: number;
    receiverAccountName: string;
    receiverAccountCategory: 'ALIPAY_ACCOUNT' | 'WECHAT_ACCOUNT' | 'BANK_ACCOUNT';
    receiverAccountIdentifier: 'QR_CODE_IMAGE' | 'EMAIL' | 'PHONE_NUMBER' | 'NONE'; // Should match your backend enum
    qrCodeImageUrl?: string | null; // URL to the QR code image if applicable
    email?: string | null;
    phoneNumber?: string | null;
    bankAccountNumber?: string | null; // Keep as string if it can have leading zeros or special chars
    bankId?: number | null;
    countryId?: number | null;
    cardHolderName?: string | null;
    bankName?: string | null;
    clientId: number; // The ID of the client this account belongs to
    creationDate: string; // ISO 8601 string, e.g., "2023-10-26T10:00:00Z"
    lastUpdatedDate: string;
    // Potentially add nested Bank or Country objects if your DTO includes them
    bank?: Bank;
    country?: Country;
}

// Generic backend response structure (reusable)
export interface BackendGenericResponse<T> {
    timeStamp: string;
    statusCode: number;
    status: string; // e.g., "OK", "UNAUTHORIZED"
    message: string;
    developerMessage?: string;
    path?: string;
    requestMethod?: string;
    data?: T; // The actual payload will be of type T
}

// Specific payload for fetching multiple receiver accounts
export interface ReceiverAccountsPayload {
    receiverAccounts: ReceiverAccount[];
}
