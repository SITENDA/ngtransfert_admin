//  src/app/[locale]/(protected_pages)/nnyinimu/add-receiver-account/AddReceiverAccountForm.tsx

"use client";

import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { useOrderedReceiverAccountCategories } from "@/hooks/ReceiverAccountType";

import {
    ReceiverAccountCategoryEnum,
    ReceiverAccountIdentifierEnum,
    ReceiverAccountSchema,
} from "@/zod-schemas/receiver-account";

import { RequestReceiverAccount } from "../../../../../../types/receiver-account";

type Props = {
    receiverAccount?: RequestReceiverAccount;
};

type FormValues = z.infer<typeof ReceiverAccountSchema>;

export default function AddReceiverAccountForm({ receiverAccount }: Props) {
    const searchParams = useSearchParams();
    const hasReceiverAccountId = searchParams.has("receiverAccountId");
    const orderedReceiverAccountTypes = useOrderedReceiverAccountCategories();

    const emptyValues: FormValues = {
        receiverAccountName: "",
        receiverAccountCategory:
        ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT,
        receiverAccountIdentifier:
        ReceiverAccountIdentifierEnum.enum.EMAIL,
        email: "",
        phoneNumber: "",
        bankAccountNumber: "",
        bankId: null,
        countryId: null,
        cardHolderName: "",
        bankName: "",
    };

    const defaultValues: FormValues =
        hasReceiverAccountId && receiverAccount
            ? {
                receiverAccountName: receiverAccount.receiverAccountName ?? "",
                receiverAccountCategory:
                receiverAccount.receiverAccountCategory,
                receiverAccountIdentifier:
                receiverAccount.receiverAccountIdentifier,
                email: receiverAccount.email ?? "",
                phoneNumber: receiverAccount.phoneNumber ?? "",
                bankAccountNumber: receiverAccount.bankAccountNumber ?? "",
                bankId: receiverAccount.bankId ?? null,
                countryId: null,
                cardHolderName: receiverAccount.cardHolderName ?? "",
                bankName: "",
            }
            : emptyValues;

    const form = useForm<FormValues>({
        mode: "onBlur",
        resolver: zodResolver(ReceiverAccountSchema),
        defaultValues,
    });

    const onSubmit = (data: FormValues) => {
        const payload: RequestReceiverAccount = {
            receiverAccountId: receiverAccount?.receiverAccountId ?? 0,
            receiverAccountName: data.receiverAccountName,
            receiverAccountCategory:
                data.receiverAccountCategory as RequestReceiverAccount["receiverAccountCategory"],
            receiverAccountIdentifier:
                data.receiverAccountIdentifier as RequestReceiverAccount["receiverAccountIdentifier"],
            email: data.email || undefined,
            phoneNumber: data.phoneNumber || undefined,
            bankAccountNumber: data.bankAccountNumber || undefined,
            cardHolderName: data.cardHolderName || undefined,
            bankId: data.bankId ?? 0,

            balance: 0,
            currencyId: 1,
            limit: 60000,
            limitCurrencyId: 1,
            clientId: receiverAccount?.clientId ?? 0,
            creationDate: receiverAccount?.creationDate ?? new Date(),

            qrCodeUrl: "",
            qrCodeContent: "",
        };

        console.log("FINAL PAYLOAD:", payload);
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl bg-background/80 backdrop-blur-sm border border-border dark:bg-gray-800/80 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
                Add Receiver Account
            </h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <SelectWithLabel
                        fieldTitle="Receiver account type"
                        nameInSchema="receiverAccountCategory"
                        data={orderedReceiverAccountTypes}
                        control={form.control}
                    />

                    {/* Add more fields here */}

                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </form>
            </Form>
        </div>
    );
}