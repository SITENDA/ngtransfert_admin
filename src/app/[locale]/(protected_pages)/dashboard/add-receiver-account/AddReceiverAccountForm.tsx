//  src/app/[locale]/(protected_pages)/dashboard/add-receiver-account/AddReceiverAccountForm.tsx

"use client";

import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { useOrderedReceiverAccountCategories } from "@/hooks/ReceiverAccountType";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useSearchParams } from "next/navigation";
import {
    ReceiverAccountIdentifierEnum,
    ReceiverAccountCategoryEnum,
    ReceiverAccountSchema,
} from "@/zod-schemas/receiver-account";
import { RequestReceiverAccount } from "../../../../../../types/receiver-account";
import { z } from "zod";

type Props = {
    receiverAccount: RequestReceiverAccount;
};

type FormValues = z.infer<typeof ReceiverAccountSchema>;

export default function AddReceiverAccountForm({ receiverAccount }: Props) {
    const searchParams = useSearchParams();
    const hasReceiverAccountId = searchParams.has("receiverAccountId");
    const orderedReceiverAccountTypes = useOrderedReceiverAccountCategories();

    const emptyValues: RequestReceiverAccount = {
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

    const defaultValues: RequestReceiverAccount = hasReceiverAccountId
        ? {
            receiverAccountCategory:
                receiverAccount.receiverAccountCategory ??
                ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT,
            receiverAccountIdentifier:
                receiverAccount.receiverAccountIdentifier ??
                ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER,
            receiverAccountId: receiverAccount.receiverAccountId ?? 0,
            receiverAccountName: receiverAccount.receiverAccountName ?? "",
            clientId: receiverAccount.clientId ?? 0,
            qrCodeUrl: receiverAccount.qrCodeUrl ?? "",
            qrCodeContent: receiverAccount.qrCodeContent ?? "",
            email: receiverAccount.email ?? "",
            phoneNumber: receiverAccount.phoneNumber ?? "",
            balance: receiverAccount.balance ?? 0,
            bankAccountNumber: receiverAccount.bankAccountNumber ?? "",
            bankId: receiverAccount.bankId ?? -1,
            limit: receiverAccount.limit ?? 60000,
            currencyId: receiverAccount.currencyId ?? -1,
            limitCurrencyId: receiverAccount.limitCurrencyId ?? -1,
            creationDate: receiverAccount.creationDate ?? new Date(),
        }
        : emptyValues;

    const form = useForm<FormValues>({
        mode: "onBlur",
        resolver: zodResolver(ReceiverAccountSchema),
        defaultValues,
    });

    return (
        <div>
            AddReceiverAccountForm
            <Form {...form}>
                <SelectWithLabel
                    fieldTitle="Receiver account type"
                    nameInSchema="receiverAccountCategory"
                    data={orderedReceiverAccountTypes}
                    control={form.control}
                />
            </Form>
        </div>
    );
}