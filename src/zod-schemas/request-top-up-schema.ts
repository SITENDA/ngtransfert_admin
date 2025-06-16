// src/zod-schemas/request-top-up-schema.ts
import { z } from "zod";
import {ReceiverAccountCategoryEnum} from "@/zod-schemas/receiver-account";
import {TopUpMethodEnum} from "@/hooks/useOrderedTopUpMethods";

export const RequestTopUpSchema = z.object({
    receiverAccountCategory: z.nativeEnum(ReceiverAccountCategoryEnum.enum), // must be backend enum compatible
    accountIdentifier: z.string().min(1, "Account Identifier is required."),
    accountId: z.coerce.number().int().positive("Account ID must be a positive integer."),
    currency: z.string().min(1, "Currency is required."),

    amountInCNY: z.coerce.number().positive("Amount must be greater than zero.").optional().nullable(),
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

    countryOfDepositId: z.coerce.number().int().positive("Country of Deposit ID must be a positive integer."),

    topUpMethod: z.nativeEnum(TopUpMethodEnum).nullable(),
});

export type RequestTopUpSchemaType = z.infer<typeof RequestTopUpSchema>;