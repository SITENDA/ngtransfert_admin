// src/lib/schemas/ReceiverAccountSchema.ts
// This file will now be the SINGLE SOURCE OF TRUTH for ReceiverAccount related enums and schema

import { z } from "zod";

// --- ReceiverAccountCategory Enum (Zod and TS Type) ---
// Define the Zod enum directly here
export const ReceiverAccountCategoryEnum = z.enum([
    "WECHAT_ACCOUNT",
    "ALIPAY_ACCOUNT",
    "BANK_ACCOUNT",
    // IMPORTANT: Add all other possible values from your Java ReceiverAccountType enum
    // If you have CRYPTO_WALLET or CASH_PICKUP, add them here.
    // e.g., "CRYPTO_WALLET", "CASH_PICKUP"
]);
// Infer the TypeScript literal union type from the Zod enum
export type ReceiverAccountCategoryType = z.infer<typeof ReceiverAccountCategoryEnum>;


// --- ReceiverAccountIdentifier Enum (Zod and TS Type) ---
// Define the Zod enum directly here
export const ReceiverAccountIdentifierEnum = z.enum([
    "EMAIL",
    "PHONE_NUMBER",
    "QR_CODE_IMAGE",
    "NONE"
    // IMPORTANT: Add all other possible values from your Java ReceiverAccountIdentifier enum
]);
// Infer the TypeScript literal union type from the Zod enum
export type ReceiverAccountIdentifierType = z.infer<typeof ReceiverAccountIdentifierEnum>;


// --- Main Zod Schema for RequestReceiverAccountDTO ---
export const ReceiverAccountSchema = z.object({
    receiverAccountName: z.string().min(1, "Receiver account name is required."),
    // Use the exported Zod enum instance here
    receiverAccountCategory: ReceiverAccountCategoryEnum,
    clientId: z.number().int().positive("Client ID must be a positive integer."),
    // Use the exported Zod enum instance here
    receiverAccountIdentifier: ReceiverAccountIdentifierEnum,

    // MultipartFile/File validation
    qrCodeImage: z.instanceof(File)
        .nullable()
        .optional()
        .refine(file => !file || file.size <= 5 * 1024 * 1024, `Max image size is 5MB.`)
        .refine(file => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Only .jpg, .jpeg, .png and .webp formats are supported.'),

    email: z.string().email("Invalid email format.").optional().or(z.literal('')),
    phoneNumber: z.string().min(5, "Phone number must be at least 5 characters.").optional().or(z.literal('')),
    bankAccountNumber: z.string().optional().or(z.literal('')), // Optional empty string
    bankId: z.number().int().positive("Bank ID must be a positive integer.").optional().or(z.null()), // Allow undefined or null
    countryId: z.number().int().positive("Country ID must be a positive integer.").optional().or(z.null()), // Allow undefined or null
    cardHolderName: z.string().optional().or(z.literal('')), // Optional empty string
    bankName: z.string().optional().or(z.literal('')), // Optional empty string
});

// Infer the TypeScript type for the full schema
export type ReceiverAccountSchemaType = z.infer<typeof ReceiverAccountSchema>;