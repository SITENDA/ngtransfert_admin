// src/app/[locale]/(protected_pages)/kaasitoma/add-receiver-account/AddReceiverAccountForm.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
    ReceiverAccountCategoryEnum,
    ReceiverAccountIdentifierEnum,
    ReceiverAccountSchema,
    ReceiverAccountSchemaType
} from "@/zod-schemas/receiver-account";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderedReceiverAccountTypes } from "@/constants/ReceiverAccountType";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { FileInputWithLabel } from "@/components/inputs/FileInputWithLabel";
import {Bank} from "../../../../../../types/bank";
import BankSelect from "@/components/BankSelect"; // Ensure this path is correct

// Placeholder components
const BankNameInput = ({ control, nameInSchema, ...props }: any) => (
    <InputWithLabel fieldTitle="Bank Name" nameInSchema={nameInSchema} control={control} placeholder="e.g., Industrial and Commercial Bank of China" {...props} />
);
const CardHolderNameInput = ({ control, nameInSchema, ...props }: any) => (
    <InputWithLabel fieldTitle="Card Holder Name" nameInSchema={nameInSchema} control={control} placeholder="e.g., John Doe" {...props} />
);
const BankAccountNumberInput = ({ control, nameInSchema, ...props }: any) => (
    <InputWithLabel fieldTitle="Bank Account Number" nameInSchema={nameInSchema} control={control} placeholder="e.g., 1234567890" {...props} />
);

interface AddReceiverAccountFormProps {
    initialBanks: Bank[];
}

const AddReceiverAccountForm: React.FC<AddReceiverAccountFormProps> = ({ initialBanks }) => {
    const defaultEmptyValues: ReceiverAccountSchemaType = {
        receiverAccountName: '',
        receiverAccountCategory: null,
        clientId: undefined,
        receiverAccountIdentifier: null,
        qrCodeImage: null,
        email: '',
        phoneNumber: '',
        bankAccountNumber: '',
        bankId: null,
        countryId: null,
        cardHolderName: '',
        bankName: ''
    };

    const form = useForm<ReceiverAccountSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(ReceiverAccountSchema),
        defaultValues: defaultEmptyValues,
    });

    const watchedCategory = form.watch("receiverAccountCategory");
    const watchedIdentifier = form.watch("receiverAccountIdentifier");
    const watchedQrCodeImage = form.watch("qrCodeImage");
    const watchedBankId = form.watch("bankId");
    const watchedReceiverAccountName = form.watch("receiverAccountName");
    const [categoryName, setCategoryName] = useState<string>('Receiver');

    const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    // --- ADD THIS STATE ---
    const [isBankSelectMenuOpen, setIsBankSelectMenuOpen] = useState(false);
    // --- END ADDED STATE ---

    const currentUser = { userId: 123 };

    useEffect(() => {
        if (currentUser?.userId) {
            form.setValue("clientId", currentUser.userId, { shouldValidate: true });
        }
    }, [currentUser?.userId, form]);

    useEffect(() => {
        if (watchedBankId !== null && watchedBankId !== undefined) {
            const selectedBank = initialBanks.find(bank => bank.bankId === watchedBankId);
            if (selectedBank) {
                form.setValue("bankName", selectedBank.bankName === "Other banks" ? "" : selectedBank.bankName, { shouldValidate: true });
                if (selectedBank.country && selectedBank.country.countryId) {
                    form.setValue("countryId", selectedBank.country.countryId, { shouldValidate: true });
                } else {
                    form.setValue("countryId", null, { shouldValidate: true });
                }
            }
        } else {
            form.setValue("bankName", "", { shouldValidate: true });
            form.setValue("countryId", null, { shouldValidate: true });
        }
    }, [watchedBankId, initialBanks, form]);

    useEffect(() => {
        if (watchedCategory === ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT ||
            watchedCategory === ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT) {
            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE, { shouldValidate: true });
            if (watchedCategory === ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT) {
                setCategoryName("Alipay");
            } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT) {
                setCategoryName("Wechat");
            }
            form.setValue("bankAccountNumber", "");
            form.setValue("bankId", null);
            form.setValue("countryId", null);
            form.setValue("cardHolderName", "");
            form.setValue("bankName", "");
        } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT) {
            setCategoryName("Bank");
            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.NONE, { shouldValidate: true });
            form.setValue("email", "");
            form.setValue("phoneNumber", "");
            form.setValue("qrCodeImage", null);
            setQrCodePreview(null);
        } else {
            form.setValue("receiverAccountIdentifier", null);
            form.setValue("email", "");
            form.setValue("phoneNumber", "");
            form.setValue("qrCodeImage", null);
            setQrCodePreview(null);
            form.setValue("bankAccountNumber", "");
            form.setValue("bankId", null);
            form.setValue("countryId", null);
            form.setValue("cardHolderName", "");
            form.setValue("bankName", "");
            setCategoryName('Receiver');
        }
    }, [watchedCategory, form]);

    useEffect(() => {
        if (watchedQrCodeImage instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrCodePreview(reader.result as string);
            };
            reader.readAsDataURL(watchedQrCodeImage);
        } else {
            setQrCodePreview(null);
        }
    }, [watchedQrCodeImage]);

    const onSubmit = async (data: ReceiverAccountSchemaType) => {
        setLoading(true);
        console.log("Form submitted with data:", data);

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            const value = data[key as keyof ReceiverAccountSchemaType];
            if (value !== null && value !== undefined && (typeof value !== 'string' || value !== '')) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === 'number' || typeof value === 'boolean') {
                    formData.append(key, value.toString());
                } else if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value as string);
                }
            }
        });

        formData.set("receiverAccountIdentifier",
            watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT ?
                ReceiverAccountIdentifierEnum.enum.NONE.toString() :
                (watchedIdentifier?.toString() || ReceiverAccountIdentifierEnum.enum.NONE.toString())
        );

        setTimeout(() => {
            setLoading(false);
            alert("Form submitted successfully! (Mocked)");
            form.reset(defaultEmptyValues);
        }, 1500);
    };

    const selectedBankIsOther = watchedBankId && initialBanks.find(bank => bank.bankId === watchedBankId)?.bankName === "Other banks";

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto p-4 border rounded-lg shadow-md">
                {/* Receiver Account Type Selector */}
                <SelectWithLabel<ReceiverAccountSchemaType>
                    fieldTitle="Receiver Account Type"
                    nameInSchema="receiverAccountCategory"
                    data={orderedReceiverAccountTypes}
                    control={form.control}
                    placeholderHint="Select WeChat, Alipay, or Bank Account"
                />
                {watchedCategory &&
                <div>
                    {/*className="space-y-4 border p-3 rounded-md"*/}
                    {/*<h3 className="text-lg font-semibold">{categoryName} Account Details</h3>*/}
                    {/* Receiver Account Name (always visible if category selected) */}
                        <InputWithLabel<ReceiverAccountSchemaType>
                            fieldTitle={`${categoryName} Account Name`}
                            nameInSchema="receiverAccountName"
                            control={form.control}
                            placeholder={`e.g., My ${categoryName} Account`}
                        />

                    {/* Conditional fields based on selected Category */}
                    {(watchedCategory === ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT ||
                        watchedCategory === ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT) && (
                        <div className="space-y-4 border p-3 rounded-md">
                            <h3 className="text-lg font-semibold">Account Identification</h3>
                            {watchedIdentifier === ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE && (
                                <FileInputWithLabel<ReceiverAccountSchemaType>
                                    fieldTitle="QR Code Image"
                                    nameInSchema="qrCodeImage"
                                    control={form.control}
                                    imagePreview={qrCodePreview}
                                    accept=".jpg,.jpeg,.png,.webp"
                                />
                            )}
                            {watchedIdentifier === ReceiverAccountIdentifierEnum.enum.EMAIL && (
                                <InputWithLabel<ReceiverAccountSchemaType>
                                    fieldTitle="Email"
                                    nameInSchema="email"
                                    control={form.control}
                                    placeholder="receiver@example.com"
                                />
                            )}
                            {watchedIdentifier === ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER && (
                                <InputWithLabel<ReceiverAccountSchemaType>
                                    fieldTitle="Phone Number"
                                    nameInSchema="phoneNumber"
                                    control={form.control}
                                    placeholder="e.g., +861234567890"
                                />
                            )}

                            <div className="flex flex-col gap-2">
                                {watchedIdentifier !== ReceiverAccountIdentifierEnum.enum.EMAIL && (
                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={() => {
                                            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.EMAIL, { shouldValidate: true });
                                            form.setValue("qrCodeImage", null);
                                            setQrCodePreview(null);
                                            form.setValue("phoneNumber", "");
                                        }}
                                        className="text-blue-500 hover:underline text-sm p-0 justify-start"
                                    >
                                        Use Email instead
                                    </Button>
                                )}
                                {watchedIdentifier !== ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER && (
                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={() => {
                                            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER, { shouldValidate: true });
                                            form.setValue("qrCodeImage", null);
                                            setQrCodePreview(null);
                                            form.setValue("email", "");
                                        }}
                                        className="text-blue-500 hover:underline text-sm p-0 justify-start"
                                    >
                                        Use Phone Number instead
                                    </Button>
                                )}
                                {watchedIdentifier !== ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE && (
                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={() => {
                                            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE, { shouldValidate: true });
                                            form.setValue("email", "");
                                            form.setValue("phoneNumber", "");
                                        }}
                                        className="text-blue-500 hover:underline text-sm p-0 justify-start"
                                    >
                                        Use QR Code instead
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bank Account Fields */}
                    {watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT && watchedReceiverAccountName != null && watchedReceiverAccountName != '' && (
                        <div>
                            <Controller
                                control={form.control}
                                name="bankId"
                                render={({ field }) => (
                                    <BankSelect
                                        {...field}
                                        banks={initialBanks}
                                        placeholderHint="Select a Bank"
                                        // --- PASS THE NEW PROP ---
                                        onMenuStateChange={setIsBankSelectMenuOpen}
                                        // --- END NEW PROP ---
                                    />
                                )}
                            />
                            {/* --- CONDITIONAL RENDERING --- */}
                            {!isBankSelectMenuOpen && ( // Only render if bank select menu is NOT open
                                <>
                                    {selectedBankIsOther && watchedBankId != null && (
                                        <BankNameInput
                                            nameInSchema="bankName"
                                            control={form.control}
                                        />
                                    )}
                                    {
                                        watchedBankId != null && <>
                                            <CardHolderNameInput
                                                nameInSchema="cardHolderName"
                                                control={form.control}
                                            />
                                            <BankAccountNumberInput
                                                nameInSchema="bankAccountNumber"
                                                control={form.control}
                                            />
                                        </>
                                    }
                                </>
                            )}
                        </div>
                    )}
                </div>
                }

                {/* Submit Button */}
                {/* --- CONDITIONAL RENDERING --- */}
                {!isBankSelectMenuOpen && watchedBankId != null && ( // Only render if bank select menu is NOT open
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Adding account...' : 'Add Account'}
                    </Button>
                )}
            </form>
        </Form>
    );
};

export default AddReceiverAccountForm;