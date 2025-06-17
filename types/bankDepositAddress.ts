import {Bank} from "./bank";

/**
 * Represents BankDepositAddress data received from the backend.
 * Corresponds to the Java `BankDepositAddressDTO`.
 */
export interface BankDepositAddress {
    bankDepositAddressId: number; // Corresponds to Java's `Long bankDepositAddressId`
    address: string;              // Corresponds to Java's `String address`
    bank: Bank;                   // Corresponds to Java's `BankDTO bank` - this is the key change
}

// --- NEW TYPES FOR THE HTTP RESPONSE STRUCTURE ---

/**
 * Represents the 'data' field payload when fetching banks.
 * This matches the `{ "banks": [...] }` object in your response.
 */
export interface BankDepositAddressDataPayload {
    bankDepositAddresses: BankDepositAddress[];
}