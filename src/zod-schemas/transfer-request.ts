// src/zod-schemas/transfer-request.ts
import { z } from "zod";
import { ReceiverAccountCategoryEnum } from "./receiver-account"; // Re-use the existing enum

export const TransferRequestSchema = z.object({
    // Country of Deposit: Always required as it's the first selection
    countryOfDepositId: z.coerce.number().positive("Country of deposit is required."),

    // Currency: Optional initially (to allow `undefined` in default values),
    // will be conditionally required later via superRefine once country is selected.
    currencyId: z.coerce.number().optional().nullable(),

    // Amount, Rate, Remark, Receiver Account Category, Receiver Account ID:
    // Optional initially, will be conditionally required later via superRefine
    // once currency is selected.
    amount: z.coerce.number().optional().nullable(),
    rate: z.coerce.number().optional().nullable(),
    remark: z.string().max(255, "Remark must be at most 255 characters.").optional().nullable(),
    receiverAccountCategory: z.nativeEnum(ReceiverAccountCategoryEnum.enum).optional().nullable(),
    receiverAccountId: z.coerce.number().optional().nullable(),

    // Client ID: Required, but typically pre-filled by the server component.
    clientId: z.coerce.number().positive("Client ID is required."),
}).superRefine((data, ctx) => {
    // --- Conditional Validation Logic ---

    // 1. If countryOfDepositId is selected, then currencyId becomes required.
    // We check for null/undefined or a non-positive value after coercion.
    if (data.countryOfDepositId && (data.currencyId === null || data.currencyId === undefined || data.currencyId <= 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Currency is required when country of deposit is selected.",
            path: ["currencyId"], // Path points to the currencyId field
        });
    }

    // 2. If currencyId is selected, then dependent fields become required.
    if (data.currencyId) {
        // Amount must be greater than 0
        if (data.amount === null || data.amount === undefined || data.amount <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Amount must be greater than 0 when currency is selected.",
                path: ["amount"],
            });
        }
        // Rate must be greater than 0 (or adjust to >= 0 if 0 is allowed)
        if (data.rate === null || data.rate === undefined || data.rate <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Exchange Rate must be greater than 0 when currency is selected.",
                path: ["rate"],
            });
        }
        // Remark can remain optional even if currency is selected, if that's your business logic.
        // If remark becomes required here:
        // if (data.remark === null || data.remark === undefined || data.remark.trim() === "") {
        //     ctx.addIssue({
        //         code: z.ZodIssueCode.custom,
        //         message: "Remark is required when currency is selected.",
        //         path: ["remark"],
        //     });
        // }

        // Receiver Account Category is required
        if (data.receiverAccountCategory === null || data.receiverAccountCategory === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Receiver account category is required when currency is selected.",
                path: ["receiverAccountCategory"],
            });
        }

        // Receiver Account ID is required and positive
        if (data.receiverAccountId === null || data.receiverAccountId === undefined || data.receiverAccountId <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Receiver account is required when currency is selected.",
                path: ["receiverAccountId"],
            });
        }
    }
});

export type TransferRequestSchemaType = z.infer<typeof TransferRequestSchema>;
