"use client"

import React from 'react';
import {SelectWithLabel} from "@/components/inputs/SelectWithLabel";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
    ReceiverAccountCategoryEnum, ReceiverAccountIdentifierEnum,
    ReceiverAccountSchema,
    ReceiverAccountSchemaType
} from "@/zod-schemas/receiver-account";
import {zodResolver} from "@hookform/resolvers/zod";
import {orderedReceiverAccountTypes} from "@/constants/ReceiverAccountType";
import {InputWithLabel} from "@/components/inputs/InputWithLabel";
import {Button} from "@/components/ui/button";

const AddReceiverAccountForm = () => {

    const emptyValues: ReceiverAccountSchemaType = {
        receiverAccountName: '',
        receiverAccountCategory: ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT, // Use .enum.<VALUE>
        clientId: 0, // Default to a valid number, or make it optional in schema if 0 is not valid
        receiverAccountIdentifier: ReceiverAccountIdentifierEnum.enum.EMAIL, // Use .enum.<VALUE>
        qrCodeImage: null, // Default for File input is null
        email: '',
        phoneNumber: '',
        bankAccountNumber: '',
        // Use null for optional numbers if schema allows null, or undefined
        bankId: null,
        countryId: null,
        cardHolderName: '',
        bankName: ''
    }

    const defaultValues: ReceiverAccountSchemaType = emptyValues

    const form = useForm<ReceiverAccountSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(ReceiverAccountSchema),
        defaultValues,
    });

    const onSubmit = (data: ReceiverAccountSchemaType) => {
        console.log("Form submitted with data:", data);
        // Here you would send `data` to your backend
        // Remember to handle file uploads (qrCodeImage) using FormData for your API call
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <SelectWithLabel<ReceiverAccountSchemaType>
                    fieldTitle="Receiver account type"
                    nameInSchema="receiverAccountCategory"
                    data={orderedReceiverAccountTypes}
                    control={form.control}
                />

                <InputWithLabel<ReceiverAccountSchemaType>
                    fieldTitle="Receiver Account Name"
                    nameInSchema="receiverAccountName"
                    control={form.control}
                    placeholder="e.g., My Alipay Account"
                />

                {/* Conditional rendering for other fields based on identifier/category */}
                {form.watch("receiverAccountIdentifier") === ReceiverAccountIdentifierEnum.enum.EMAIL && (
                    <InputWithLabel<ReceiverAccountSchemaType>
                        fieldTitle="Email"
                        nameInSchema="email"
                        control={form.control}
                        placeholder="receiver@example.com"
                    />
                )}

                {form.watch("receiverAccountIdentifier") === ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER && (
                    <InputWithLabel<ReceiverAccountSchemaType>
                        fieldTitle="Phone Number"
                        nameInSchema="phoneNumber"
                        control={form.control}
                        placeholder="e.g., +861234567890"
                    />
                )}

                {/* Add other fields as needed based on logic */}
                {/* Example for bank details if category is BANK_ACCOUNT */}
                {form.watch("receiverAccountCategory") === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT && (
                    <>
                        <InputWithLabel<ReceiverAccountSchemaType>
                            fieldTitle="Bank Account Number"
                            nameInSchema="bankAccountNumber"
                            control={form.control}
                            placeholder="e.g., 1234567890"
                        />
                        <InputWithLabel<ReceiverAccountSchemaType>
                            fieldTitle="Bank Name"
                            nameInSchema="bankName"
                            control={form.control}
                            placeholder="e.g., Industrial and Commercial Bank of China"
                        />
                        <InputWithLabel<ReceiverAccountSchemaType>
                            fieldTitle="Card Holder Name"
                            nameInSchema="cardHolderName"
                            control={form.control}
                            placeholder="e.g., John Doe"
                        />
                        {/* Add inputs for bankId and countryId if needed */}
                    </>
                )}


                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
};

export default AddReceiverAccountForm;