import {Country} from "./country";

/**
 * Represents CashDepositAddress data received from the backend.
 * Corresponds to the Java `CashDepositAddressDTO`.
 */
export interface CashDepositAddress {
    cashDepositAddressId: number; // Corresponds to Java's `Long bankDepositAddressId`
    address: string;              // Corresponds to Java's `String address`
    country: Country;                   // Corresponds to Java's `CountryDTO` - this is the key change
}

// --- NEW TYPES FOR THE HTTP RESPONSE STRUCTURE ---

/**
 * Represents the 'data' field payload when fetching banks.
 * This matches the `{ "banks": [...] }` object in your response.
 */
export interface CashDepositAddressDataPayload {
    cashDepositAddresses: CashDepositAddress[];
}