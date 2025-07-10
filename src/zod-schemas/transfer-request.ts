// src/zod-schemas/transfer-request.ts
import { z } from "zod";

export const TransferRequestSchema = z.object({
    // Keep optional().nullable() for initial default values,
    // validation will happen in superRefine on submission.
    countryOfDepositId: z.coerce.number().optional().nullable(),
    amount: z.coerce.number().optional().nullable(),
    rate: z.coerce.number().optional().nullable(),

    // Remark remains optional with max length
    remark: z.string().max(255, "Remark must be at most 255 characters.").optional().nullable(),

    // These fields remain optional for this debugging step
    currencyCode:  z.coerce.string().optional().nullable(),
    receiverAccountId: z.coerce.number().optional().nullable(),

    // Client ID remains required and positive
    clientId: z.coerce.number().positive("Client ID is required."),
}).superRefine((data, ctx) => {
    // --- Conditional Validation Logic ---

    // 1. Validate countryOfDepositId
    if (data.countryOfDepositId === null || data.countryOfDepositId === undefined || data.countryOfDepositId <= 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Country of deposit is required.",
            path: ["countryOfDepositId"],
        });
    }

    // 2. Validate Amount
    // This condition means Amount is required IF countryOfDepositId is selected
    // If you want Amount to be required regardless of country selection,
    // remove the 'else if' and make it a standalone 'if'.
    // For now, let's make it dependent on countryOfDepositId selection as that's common.
    if (data.countryOfDepositId && data.countryOfDepositId > 0) { // Only if a country is selected
        if (data.amount === null || data.amount === undefined || data.amount <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Amount must be greater than 0.",
                path: ["amount"],
            });
        }

        // 3. Validate Rate
        if (data.rate === null || data.rate === undefined || data.rate <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Rate must be greater than 0.",
                path: ["rate"],
            });
        }
    }
    // Note: If you want 'amount' and 'rate' to be required even without
    // a country selection, move their validation outside the `if (data.countryOfDepositId && data.countryOfDepositId > 0)` block.
});

export type TransferRequestSchemaType = z.infer<typeof TransferRequestSchema>;