import {Country} from "./country";

/**
 * Represents bank data received from the backend.
 * Corresponds to the Java `BankDTO`.
 */
export interface Bank {
    bankId: number;         // Corresponds to Java's `Long bankId`
    bankName: string;       // Corresponds to Java's `String bankName`
    bankNameEng: string;    // Corresponds to Java's `String bankNameEng`
    bankShortName: string;  // Corresponds to Java's `String bankShortName`
    bankLogoUrl: string;    // Corresponds to Java's `String bankLogoUrl`
    country: Country;       // Corresponds to Java's `CountryDTO country` - now properly typed
}

// --- NEW TYPES FOR THE HTTP RESPONSE STRUCTURE ---

/**
 * Represents the 'data' field payload when fetching banks.
 * This matches the `{ "banks": [...] }` object in your response.
 */
export interface BankDataPayload {
    banks: Bank[];
}

/**
 * Represents the standardized HTTP response wrapper from your backend.
 * `T` is a generic type for the actual data payload (e.g., `BankDataPayload` for banks).
 * Corresponds to your Java `HttpResponse` class.
 */
export interface BackendHttpResponse<T> {
    timeStamp: string;
    statusCode: number;
    status: string;
    message: string;
    data: T; // This will hold the specific payload (e.g., BankDataPayload)
}

export interface BankLogoProps {
    logoUrl?: string | null;
    alt: string;
    style?: React.CSSProperties;
}