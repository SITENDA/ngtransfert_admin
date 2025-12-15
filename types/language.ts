/**
 * Represents language data received from the backend.
 * Corresponds to the Java `LanguageDTO`.
 * (Assumed fields based on common language DTO patterns)
 */
export interface Language {
    languageId: number;       // Corresponds to Java's Long
    languageName: string;     // e.g., "English", "Mandarin"
    languageCode: string;     // e.g., "en", "zh"
    // Add any other properties your Java LanguageDTO has
}