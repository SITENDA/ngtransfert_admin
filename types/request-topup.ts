import {ReceiverAccountCategoryType} from "@/zod-schemas/receiver-account";

export interface RequestTopUp {
    receiverAccountCategory: ReceiverAccountCategoryType; // 'WECHAT_ACCOUNT' | 'ALIPAY_ACCOUNT' | 'BANK_ACCOUNT'
    accountIdentifier: string; // General string, can be email, phone, QR code image name, etc.
    accountId: number; // Must be a positive integer (Long in Java)
    currency: string; // Example: 'CNY'
    amountInCNY: number; // BigDecimal in Java maps to number in TypeScript
    sendingFee: number; // BigDecimal in Java maps to number in TypeScript
    proofPicture: File | null; // MultipartFile in Java maps to File in TS
}
