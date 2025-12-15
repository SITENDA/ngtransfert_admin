/**
 * Represents currency data received from the backend.
 * Corresponds to the Java `CurrencyDTO`.
 * (Assumed fields based on common currency DTO patterns)
 */
export interface Currency {
    currencyId: number;       // Corresponds to Java's Long
    currencyCode: string;     // e.g., "USD", "CNY"
    currencyName: string;     // e.g., "United States Dollar", "Chinese Yuan Renminbi"
    currencySymbol: string;
    // Add any other properties your Java CurrencyDTO has
}

export interface CurrencyDataPayload {
    currencies: Currency[];
}
