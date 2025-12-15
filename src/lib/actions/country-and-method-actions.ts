// src/lib/actions/country-and-method-actions.ts

"use server";

import { CountryAndMethodSchema, CountryAndMethodSchemaType } from "@/zod-schemas/country-and-method-schema";
import { getLocale } from "next-intl/server";
import {kaasitomaPaths} from "@/util/frontend-paths";

// Define the expected return type for your server action
interface ServerActionResult {
    success: boolean;
    message?: string;
    redirectUrl?: string;
}

export async function handleCountryAndMethodSelection(
    formData: CountryAndMethodSchemaType // Accepts the validated object directly
): Promise<ServerActionResult> {
    // console.log("SERVER ACTION: handleCountryAndMethodSelection - Received data:", formData);

    // 1. Validate the incoming data (important for server actions)
    const validationResult = CountryAndMethodSchema.safeParse(formData);

    if (!validationResult.success) {
        console.error("SERVER ACTION: Validation failed:", validationResult.error.flatten());
        return {
            success: false,
            message: "Invalid selection data provided.",
        };
    }

    const { receiverAccountCategory, accountIdentifier, accountId, countryOfDepositId, topUpMethod } = validationResult.data;

    try {
        const locale = await getLocale();

        // Ensure topUpMethod is a string, even if it could theoretically be undefined/null
        // Based on your latest schema, topUpMethod is a Zod nativeEnum, which means it should
        // always be a string value from the enum if validation passes.
        // However, if the source type (formData) still allows 'null', we must handle it.
        const effectiveTopUpMethod = topUpMethod !== undefined && topUpMethod !== null
            ? topUpMethod
            : ''; // Or handle this as an error if it should never be empty/null

        // Construct the URL for the instructions page with query parameters
        const queryParams = new URLSearchParams({
            accountId: String(accountId),
            countryId: String(countryOfDepositId),
            topUpMethod: effectiveTopUpMethod, // Use the coerced/checked value here
            receiverAccountCategory: receiverAccountCategory,
            accountIdentifier: accountIdentifier,
        }).toString();

        const redirectUrl = `/${locale}${kaasitomaPaths.topUpInstructionsPath}${queryParams}`;

        console.log("SERVER ACTION: Successfully processed selection. Redirecting to:", redirectUrl);

        return {
            success: true,
            message: "Selection processed. Redirecting to instructions.",
            redirectUrl: redirectUrl,
        };

    } catch (error: any) {
        console.error("SERVER ACTION: Error processing selection:", error);
        return {
            success: false,
            message: `Error processing selection: ${error.message || 'An unknown error occurred.'}`,
        };
    }
}