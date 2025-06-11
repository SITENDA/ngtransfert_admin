// src/lib/schemas/ReceiverAccountSchema.ts
import { z } from "zod";

// --- ReceiverAccountCategory Enum (Zod and TS Type) ---
export const ReceiverAccountCategoryEnum = z.enum([
    "WECHAT_ACCOUNT",
    "ALIPAY_ACCOUNT",
    "BANK_ACCOUNT",
    // Add other categories if you have them, e.g., "CRYPTO_WALLET", "CASH_PICKUP"
]);
export type ReceiverAccountCategoryType = z.infer<typeof ReceiverAccountCategoryEnum>;

// --- ReceiverAccountIdentifier Enum (Zod and TS Type) ---
export const ReceiverAccountIdentifierEnum = z.enum([
    "EMAIL",
    "PHONE_NUMBER",
    "QR_CODE_IMAGE",
    "NONE" // Added 'NONE' as a potential identifier if no specific one is chosen or needed.
]);
export type ReceiverAccountIdentifierType = z.infer<typeof ReceiverAccountIdentifierEnum>;


// --- Main Zod Schema for RequestReceiverAccountDTO ---
export const ReceiverAccountSchema = z.object({
    receiverAccountName: z.string().min(1, "Receiver account name is required."),
    receiverAccountCategory: z.union([
        ReceiverAccountCategoryEnum,
        z.literal(""), // Allow empty string for "All" or initial placeholder, if used
        z.null() // Allow null for initial unselected state
    ]),
    clientId: z.number().int().positive("Client ID must be a positive integer.").optional(), // Made optional
    // Allow receiverAccountIdentifier to be null initially if it's dependent on category
    receiverAccountIdentifier: z.union([
        ReceiverAccountIdentifierEnum,
        z.null() // Allow null for initial unselected/dependent state
    ]).optional(),

    // QR Code Image validation - Basic validation for file type and size
    qrCodeImage: z.instanceof(File)
        .nullable()
        .optional()
        .refine(file => !file || file.size <= 5 * 1024 * 1024, `Max image size is 5MB.`)
        .refine(file => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
    // The conditional requirement for qrCodeImage will be handled in superRefine below.
    email: z.string().email("Invalid email format.").optional().or(z.literal('')),
    phoneNumber: z.string().min(5, "Phone number must be at least 5 characters.").optional().or(z.literal('')),
    bankAccountNumber: z.string().optional().or(z.literal('')),
    bankId: z.number().int().positive("Bank ID must be a positive integer.").optional().or(z.null()),
    countryId: z.number().int().positive("Country ID must be a positive integer.").optional().or(z.null()),
    cardHolderName: z.string().optional().or(z.literal('')),
    bankName: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    // Cross-field validation based on receiverAccountIdentifier
    if (data.receiverAccountIdentifier === ReceiverAccountIdentifierEnum.enum.EMAIL && (!data.email || data.email === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email is required when identifier is Email.",
            path: ['email'],
        });
    }
    if (data.receiverAccountIdentifier === ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER && (!data.phoneNumber || data.phoneNumber === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Phone Number is required when identifier is Phone Number.",
            path: ['phoneNumber'],
        });
    }
    // QR Code Image is handled via its own refine, but you could add more checks here if needed
    if (data.receiverAccountCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT) {
        if (!data.bankAccountNumber || data.bankAccountNumber === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Bank Account Number is required for Bank Account type.",
                path: ['bankAccountNumber'],
            });
        }
        if (!data.bankId || data.bankId <= 0) { // Assuming bankId 0 is invalid
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Bank selection is required for Bank Account type.",
                path: ['bankId'],
            });
        }
        if (!data.cardHolderName || data.cardHolderName === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Card Holder Name is required for Bank Account type.",
                path: ['cardHolderName'],
            });
        }
        // Conditionally check bankName if BankId allows manual input
        // This part needs `data` from `useGetBankByIdQuery` which is client-side state,
        // so it's better to handle this specific validation within `onSubmit` or `superRefine`
        // if you can access `data.bankName` here. For now, it's optional.
    }
});

export type ReceiverAccountSchemaType = z.infer<typeof ReceiverAccountSchema>;