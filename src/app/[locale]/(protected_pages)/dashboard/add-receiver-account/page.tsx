"use client";

import AddReceiverAccountForm from "./AddReceiverAccountForm";
import {
    ReceiverAccountCategoryEnum,
    ReceiverAccountIdentifierEnum,
} from "@/zod-schemas/receiver-account";
import { RequestReceiverAccount } from "../../../../../../types/receiver-account";

export default function AddReceiverAccountPage() {
    const receiverAccount: RequestReceiverAccount = {
        receiverAccountCategory: ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT,
        receiverAccountIdentifier: ReceiverAccountIdentifierEnum.enum.EMAIL,
        receiverAccountId: -1,
        receiverAccountName: "",
        clientId: -1,
        qrCodeUrl: "",
        qrCodeContent: "",
        email: "",
        phoneNumber: "",
        balance: 0,
        bankAccountNumber: "",
        bankId: -1,
        limit: 60000,
        limitCurrencyId: -1,
        currencyId: -1,
        creationDate: new Date(),
    };

    return <AddReceiverAccountForm receiverAccount={receiverAccount} />;
}