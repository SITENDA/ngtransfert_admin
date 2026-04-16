// src/types/createReceiverAccountAction.ts

import { Bank } from "./bank";
import { Currency } from "./currency";
import {User} from "next-auth"; // You may need to define this if not already present

export interface ReceiverAccount {
    receiverAccountId: number;
    receiverAccountName: string;
    cardHolderName?: string;

    receiverAccountCategory: 'ALIPAY_ACCOUNT' | 'WECHAT_ACCOUNT' | 'BANK_ACCOUNT';
    receiverAccountIdentifier: 'QR_CODE_IMAGE' | 'EMAIL' | 'PHONE_NUMBER' | 'BANK_ACCOUNT_NUMBER';

    qrCodeUrl?: string;
    qrCodeContent?: string;
    email?: string;
    phoneNumber?: string;

    balance: number;
    currency: Currency;

    limit: number;
    limitCurrency: Currency;

    bankAccountNumber?: string;
    bank?: Bank;

    client: User;

    creationDate?: string;      // If your backend exposes these later
    lastUpdatedDate?: string;   // If available
}

export interface RequestReceiverAccount {
    receiverAccountId: number;
    receiverAccountName: string;
    cardHolderName?: string;

    receiverAccountCategory: 'ALIPAY_ACCOUNT' | 'WECHAT_ACCOUNT' | 'BANK_ACCOUNT';
    receiverAccountIdentifier: 'QR_CODE_IMAGE' | 'EMAIL' | 'PHONE_NUMBER' | 'BANK_ACCOUNT_NUMBER';

    qrCodeUrl?: string;
    qrCodeContent?: string;
    email?: string;
    phoneNumber?: string;

    balance: number;
    currencyId: number;

    limit: number;
    limitCurrencyId: number;

    bankAccountNumber?: string;
    bankId: number;

    clientId: number;
    creationDate: Date;      // If your backend exposes these later
    lastUpdatedDate?: string;   // If available
}

// For API payload shapes
export interface ReceiverAccountsPayload {
    receiverAccounts: ReceiverAccount[];
}

export interface ReceiverAccountPayload {
    receiverAccount: ReceiverAccount;
}
