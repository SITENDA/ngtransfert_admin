// src/zod-schemas/transfer-request.ts
import { z } from "zod";
import { ReceiverAccountCategoryEnum } from "./receiver-account"; // Re-use the existing enum

export const TransferRequestSchema = z.object({
    // Country of Deposit: Optional initially to allow `undefined` in default values.
    // Its positive validation will be enforced by superRefine when a currency is selected.
    countryOfDepositId: z.coerce.number().optional().nullable(),

    // Currency: Optional initially (to allow `undefined` in default values),
    // will be conditionally required later via superRefine once country is selected.
    currencyId:  z.coerce.number().optional(),

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

    // 1. Validate countryOfDepositId
    if (data.countryOfDepositId === null || data.countryOfDepositId === undefined || data.countryOfDepositId <= 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Country of deposit is required.",
            path: ["countryOfDepositId"],
        });
    } else if (data.countryOfDepositId && (!data.currencyId || data.currencyId <= 0)) {
        // 2. If country selected, currency must also be valid
        ctx.addIssue({
            path: ['currencyId'],
            code: z.ZodIssueCode.custom,
            message: 'Currency is required when a country is selected.',
        });
    }

    // 3. If currencyId is valid (positive), validate dependent fields
    if (data.currencyId && data.currencyId > 0) {
        // Amount validation
        if (data.amount === null || data.amount === undefined || data.amount <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Amount must be greater than 0 when currency is selected.",
                path: ["amount"],
            });
        }
        // Rate validation
        if (data.rate === null || data.rate === undefined || data.rate <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Rate must be greater than 0 when currency is selected.",
                path: ["rate"],
            });
        }
        // ReceiverAccountCategory validation
        if (data.receiverAccountCategory === null || data.receiverAccountCategory === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Receiver account category is required when currency is selected.",
                path: ["receiverAccountCategory"],
            });
        }
        // ReceiverAccountId validation
        if (data.receiverAccountId === null || data.receiverAccountId === undefined || data.receiverAccountId <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Receiver account ID must be provided when currency is selected.",
                path: ["receiverAccountId"],
            });
        }
    }
});

export type TransferRequestSchemaType = z.infer<typeof TransferRequestSchema>;