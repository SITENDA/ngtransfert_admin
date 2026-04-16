import {Currency} from "./currency";
import {Language} from "./language";
import React from "react";

/**
 * Represents country data received from the backend.
 * Corresponds to the Java `CountryDTO`.
 */
export interface Country {
    countryId: number;         // Corresponds to Java's `Long countryId`
    countryName: string;       // Corresponds to Java's `String countryName`
    continent: string;         // Corresponds to Java's `String continent`
    countryFlagUrl: string;    // Corresponds to Java's `String countryFlagUrl`
    currency: Currency;        // Corresponds to Java's `CurrencyDTO currency`
    language: Language;        // Corresponds to Java's `LanguageDTO language`
}

export interface CountryFlagProps {
    flagUrl?: string | null;
    alt: string;
    style?: React.CSSProperties;
}

export interface CountriesDataPayload {
    countries: Country[];
}

export interface CountryDataPayload {
    country: Country;
}