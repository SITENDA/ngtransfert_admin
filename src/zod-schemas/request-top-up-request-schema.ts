// src/zod-schemas/request-top-up-request-schema.ts
import { z } from "zod";
import { TopUpMethodEnum } from "@/enums/TopUpMethodEnum"; // Ensure this path is correct

export const RequestTopUpRequestSchema = z.object({
    receiverAccountId: z.coerce.number().int().positive("Account ID must be a positive integer."),
    amountInCNY: z.coerce.number().positive("Amount in CNY must be greater than zero.").optional().nullable(),
    destinationCurrencyCode: z.string().min(1, "Currency used in the country of deposit is required."), // This should be the destination currency code, e.g., 'XAF'
    amountInDestinationCurrency: z.coerce.number().positive("Amount in destination currency must be greater than zero.").optional().nullable(),
    sendingFee: z.coerce.number().nonnegative("Sending Fee cannot be negative.").optional().nullable(),
    sendingFeeCurrencyCode: z.string().min(1, "Currency of the sending fee is required."),
    proofPicture: z
        .instanceof(File, { message: "Proof picture is required." }) // Changed message for required proof
        .nullable() // Allow null if the field can be empty before validation
        .refine(
            (file) => file !== null && file.size > 0, // Ensure file exists and is not empty if required
            { message: "Proof picture cannot be empty." }
        )
        .refine(
            (file) => file === null || file.size <= 5 * 1024 * 1024,
            "Proof picture size must not exceed 5MB."
        )
        .refine(
            (file) => file === null || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            'Only JPG, JPEG, PNG, and WEBP formats are allowed for proof picture.'
        ),
    countryOfDepositId: z.coerce.number().int().positive("Country of Deposit ID must be a positive integer."),
    topUpMethod: z.nativeEnum(TopUpMethodEnum).nullable(), // Made nullable as per defaultFormValues

}).refine(
    (data) => {
        // At least one of amountInCNY or amountInDestinationCurrency must be present and not null
        return (data.amountInCNY !== undefined && data.amountInCNY !== null) ||
            (data.amountInDestinationCurrency !== undefined && data.amountInDestinationCurrency !== null);
    },
    {
        message: "Either Amount in CNY or Amount in Destination Currency must be provided.",
        path: ["amountInCNY"], // Attach the error to amountInCNY for display
    }
).refine(
    (data) => {
        // Proof picture is always required for a top-up
        return data.proofPicture !== null && data.proofPicture.size > 0;
    },
    {
        message: "Proof picture is required for the top-up.",
        path: ["proofPicture"],
    }
);

export type RequestTopUpSchemaType = z.infer<typeof RequestTopUpRequestSchema>;