"use client"

import {SelectWithLabel} from "@/components/inputs/SelectWithLabel";
import {
    ReceiverAccountSchema
} from "../../../../../../prisma/generated/zod";
import type {
    ReceiverAccount,
} from "../../../../../../prisma/generated/zod";

import { orderedReceiverAccountTypes } from "@/hooks/ReceiverAccountType";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form"
import {useSearchParams} from "next/navigation";
import { Prisma } from "@prisma/client";
import {ReceiverAccountCategoryEnum, ReceiverAccountIdentifierEnum} from "@/zod-schemas/receiver-account";
// import { Button } from "@/components/ui/button";
// import {z} from "zod";
// import {Prisma} from "@prisma/client";

type Props = {
    receiverAccount: ReceiverAccount;
}

function AddReceiverAccount({ receiverAccount }: Props ) {

    const searchParams = useSearchParams()
    const hasReceiverAccountId = searchParams.has("receiverAccountId")

    const emptyValues: ReceiverAccount = {
        type: ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT,
        identifier: ReceiverAccountIdentifierEnum.enum.EMAIL,
        id: '',
        name: '',
        clientId: '',
        qrCodeUrl: '',
        qrCodeContent: '',
        email: '',
        phoneNumber: '',
        balance: new Prisma.Decimal(0),
        bankAccountNumber: '',
        bankId: '',
        limit: new Prisma.Decimal(0)
    }

    const defaultValues: ReceiverAccount = hasReceiverAccountId ? {
        type: receiverAccount.type?? ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT,
        identifier: receiverAccount.identifier ?? ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER,
        id: receiverAccount.id?? 0,
        name: receiverAccount.name ?? '',
        clientId: receiverAccount.clientId ?? 0,
        qrCodeUrl: receiverAccount.qrCodeUrl ?? '',
        qrCodeContent: receiverAccount.qrCodeContent ?? '',
        email: receiverAccount.email ?? '',
        phoneNumber: receiverAccount.phoneNumber ?? '',
        balance: receiverAccount.balance?? new Prisma.Decimal(0),
        bankAccountNumber: receiverAccount.bankAccountNumber?? '',
        bankId: receiverAccount.bankId?? '',
        limit: receiverAccount.limit ?? new Prisma.Decimal(60000)
    } : emptyValues

    const form = useForm<ReceiverAccount>({
        mode: 'onBlur',
        resolver: zodResolver(ReceiverAccountSchema),
        defaultValues,
    });


  return (
    <div>
      AddReceiverAccount
        <Form {...form}>
            <SelectWithLabel<ReceiverAccount> fieldTitle="Receiver account type" nameInSchema="type" data={orderedReceiverAccountTypes} />
        </Form>
    </div>
  )
}

export default AddReceiverAccount
