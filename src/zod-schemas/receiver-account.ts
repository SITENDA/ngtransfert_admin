// src/lib/schemas/ReceiverAccountSchema.ts
import { z } from "zod";

// --- Regex patterns (replicated from your Java/frontend) ---
// Note: Zod's .regex() doesn't directly support Java's Pattern.UNICODE_CHARACTER_CLASS flag.
// For Unicode-aware regex in JS/TS, we use native Unicode property escapes like \p{L}.
// Ensure your JS environment supports the 'u' (Unicode) flag for these regexes.

// Email regex as provided (ASCII-only)
const EMAIL_REGEX_ZOD = new RegExp("^[A-Za-z0-9+_.-]+@(.+)$");

// Full Name regex (Unicode letters and spaces), equivalent to Java's [\p{L}\s]+ with UNICODE_CHARACTER_CLASS
// 'u' flag is essential for \p{L} to work in JavaScript regex
const FULL_NAME_REGEX_ZOD = new RegExp("^[\\p{L}\\s]+$", "u");

// Phone Number regex as provided (numerical with optional international prefix)
const PHONE_NUMBER_REGEX_ZOD = new RegExp("^(\\+\\d{1,3})?\\d{9,14}$");

// Bank Account Number regex as provided (6 to 18 digits)
const BANK_ACCOUNT_NUMBER_REGEX_ZOD = new RegExp("^\\d{6,18}$");


// --- ReceiverAccountCategory Enum (Zod and TS Type) ---
export const ReceiverAccountCategoryEnum = z.enum([
    "WECHAT_ACCOUNT",
    "ALIPAY_ACCOUNT",
    "BANK_ACCOUNT",
]);
export type ReceiverAccountCategoryType = z.infer<typeof ReceiverAccountCategoryEnum>;

// --- ReceiverAccountIdentifier Enum (Zod and TS Type) ---
export const ReceiverAccountIdentifierEnum = z.enum([
    "EMAIL",
    "PHONE_NUMBER",
    "QR_CODE_IMAGE",
    "BANK_ACCOUNT_NUMBER",
    "NONE"
]);
export type ReceiverAccountIdentifierType = z.infer<typeof ReceiverAccountIdentifierEnum>;


// --- Main Zod Schema for RequestReceiverAccountDTO ---
export const ReceiverAccountSchema = z.object({
    receiverAccountName: z.string().min(1, "Receiver account name is required."),
    receiverAccountCategory: z.union([
        ReceiverAccountCategoryEnum,
        z.literal(""),
        z.null()
    ]),
    clientId: z.number().int().positive("Client ID must be a positive integer.").optional(),
    receiverAccountIdentifier: z.union([
        ReceiverAccountIdentifierEnum,
        z.null()
    ]).optional(),

    qrCodeImage: z.instanceof(File)
        .nullable()
        .optional()
        .refine(file => !file || file.size <= 5 * 1024 * 1024, `Max image size is 5MB.`)
        .refine(file => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Only .jpg, .jpeg, .png and .webp formats are supported.'),

    // Apply the custom regex for email
    email: z.string()
        .regex(EMAIL_REGEX_ZOD, "Invalid email format.")
        .optional()
        .or(z.literal('')),

    // Apply the custom regex for phone number
    phoneNumber: z.string()
        .regex(PHONE_NUMBER_REGEX_ZOD, "Invalid phone number format.")
        .optional()
        .or(z.literal('')),

    // Apply the custom regex for bank account number
    bankAccountNumber: z.string()
        .regex(BANK_ACCOUNT_NUMBER_REGEX_ZOD, "Invalid bank account number format (6-18 digits).")
        .optional()
        .or(z.literal('')),

    bankId: z.number().int().positive("Bank ID must be a positive integer.").optional().or(z.null()),
    countryId: z.number().int().positive("Country ID must be a positive integer.").optional().or(z.null()),

    // Apply the custom regex for card holder name (using FULL_NAME_REGEX_ZOD)
    cardHolderName: z.string()
        .regex(FULL_NAME_REGEX_ZOD, "Card holder name must be a valid name (letters and spaces only).")
        .optional()
        .or(z.literal('')),

    bankName: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    // Conditional validation for identifier-specific fields
    if (data.receiverAccountIdentifier === ReceiverAccountIdentifierEnum.enum.EMAIL) {
        if (!data.email || data.email === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Email is required when identifier is Email.",
                path: ['email'],
            });
        }
    }
    if (data.receiverAccountIdentifier === ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER) {
        if (!data.phoneNumber || data.phoneNumber === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Phone Number is required when identifier is Phone Number.",
                path: ['phoneNumber'],
            });
        }
    }

    // Conditional validation for Bank Account specific fields
    if (data.receiverAccountCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT) {
        if (!data.bankAccountNumber || data.bankAccountNumber === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Bank Account Number is required for Bank Account type.",
                path: ['bankAccountNumber'],
            });
        }
        if (!data.bankId || data.bankId <= 0) {
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
        // Note: The `bankName` validation (for "Other banks") is typically handled
        // in the UI or on the backend where the selected bank's "isOther" property is known.
        // If `bankName` is conditionally required based on `bankId` selection,
        // you'd add a superRefine rule here looking at `data.bankId` and `data.bankName`.
    }
});

export type ReceiverAccountSchemaType = z.infer<typeof ReceiverAccountSchema>;