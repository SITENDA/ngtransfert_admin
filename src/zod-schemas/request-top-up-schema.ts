// src/zod-schemas/request-top-up-schema.ts
import { z } from "zod";
import {ReceiverAccountCategoryEnum} from "@/zod-schemas/receiver-account";

export const RequestTopUpSchema = z.object({
    receiverAccountCategory: z.nativeEnum(ReceiverAccountCategoryEnum.enum), // Ensure it's a Zod enum directly
    accountIdentifier: z.string().min(1, "Account Identifier is required."),
    accountId: z.coerce.number().int().positive("Account ID must be a positive integer."),
    currency: z.string().min(1, "Currency is required."),

    // FIX: Make amountInCNY optional to allow 'undefined' in default values
    amountInCNY: z.coerce.number().positive("Amount must be greater than zero.").optional().nullable(),
    // FIX: Make sendingFee optional to allow 'undefined' in default values
    sendingFee: z.coerce.number().nonnegative("Sending Fee cannot be negative.").optional().nullable(),

    proofPicture: z
        .instanceof(File)
        .nullable()
        .refine(
            file => !file || file.size <= 5 * 1024 * 1024,
            "Proof picture size must not exceed 5MB."
        )
        .refine(
            file => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            'Only JPG, JPEG, PNG, and WEBP formats are allowed for proof picture.'
        ),
});

export type RequestTopUpSchemaType = z.infer<typeof RequestTopUpSchema>;
