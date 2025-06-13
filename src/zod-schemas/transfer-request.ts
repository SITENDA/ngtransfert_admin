// src/zod-schemas/transfer-request.ts
import { z } from "zod";
import { ReceiverAccountCategoryEnum } from "./receiver-account"; // Re-use the existing enum

export const TransferRequestSchema = z.object({
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0."), // Use z.coerce.number for string inputs
    currencyId: z.coerce.number().positive("Currency is required."), // Assuming ID is positive
    rate: z.coerce.number().min(0, "Rate cannot be negative."),
    remark: z.string().max(255, "Remark must be at most 255 characters.").optional().or(z.literal('')), // Optional string, allowing empty string
    receiverAccountCategory: z.nativeEnum(ReceiverAccountCategoryEnum.enum).nullable().refine(val => val !== null, "Receiver account category is required."), // Ensure it's not null
    receiverAccountId: z.coerce.number().positive("Receiver account is required."), // Assuming ID is positive
    clientId: z.coerce.number().positive("Client ID is required."), // Should be provided by server component
    countryOfDepositId: z.coerce.number().positive("Country of deposit is required."), // Assuming ID is positive
});

export type TransferRequestSchemaType = z.infer<typeof TransferRequestSchema>;
