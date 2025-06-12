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
import { useOrderedReceiverAccountCategories } from "@/constants/ReceiverAccountType";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { FileInputWithLabel } from "@/components/inputs/FileInputWithLabel";
import {Bank} from "../../../../../../types/bank";
import BankSelect from "@/components/BankSelect";
import { useTranslations } from 'next-intl';
import {useReceiverAccountIdentifiers} from "@/constants/ReceiverAccountIdentifier"; // Make sure this path is correct if moved

interface AddReceiverAccountFormProps {
    initialBanks: Bank[];
}

const AddReceiverAccountForm: React.FC<AddReceiverAccountFormProps> = ({ initialBanks }) => {
    const t = useTranslations('AddReceiverAccountForm');
    // Ensure useReceiverAccountIdentifiers is imported from the correct place
    const receiverAccountIdentifiers = useReceiverAccountIdentifiers();

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
    const [categoryName, setCategoryName] = useState<string>('');

    const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isBankSelectMenuOpen, setIsBankSelectMenuOpen] = useState(false);

    const currentUser = { userId: 123 }; // Mock current user

    useEffect(() => {
        if (currentUser?.userId) {
            form.setValue("clientId", currentUser.userId, { shouldValidate: true });
        }
    }, [currentUser?.userId, form]);

    useEffect(() => {
        if (watchedCategory === ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT) {
            setCategoryName(t('alipay'));
        } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT) {
            setCategoryName(t('wechat'));
        } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT) {
            setCategoryName(t('bank'));
        } else {
            setCategoryName(t('receiver'));
        }
    }, [watchedCategory, t]);

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
            // For Alipay/WeChat, default to QR_CODE_IMAGE, but allow user to change via select
            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE, { shouldValidate: true });
            form.setValue("bankAccountNumber", "");
            form.setValue("bankId", null);
            form.setValue("countryId", null);
            form.setValue("cardHolderName", "");
            form.setValue("bankName", "");
            // Clear other identifier fields on category change
            form.setValue("email", "");
            form.setValue("phoneNumber", "");
        } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT) {
            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.NONE, { shouldValidate: true });
            form.setValue("email", "");
            form.setValue("phoneNumber", "");
            form.setValue("qrCodeImage", null);
            setQrCodePreview(null);
        } else { // Category becomes null or unset
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
        }
    }, [watchedCategory, form]);

    // Keep this useEffect for QR code preview
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
            // Only append non-null, non-undefined, non-empty strings, and actual File objects
            if (value !== null && value !== undefined && (typeof value !== 'string' || value !== '')) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === 'number') {
                    formData.append(key, value.toString());
                } else if (typeof value === 'object' && value !== null) { // For objects that are not File
                    // Make sure value is not an empty object that could be an issue
                    if (Object.keys(value).length > 0) {
                        formData.append(key, JSON.stringify(value));
                    }
                } else {
                    formData.append(key, value as string);
                }
            }
        });

        // Ensure receiverAccountIdentifier is correctly set for submission
        formData.set("receiverAccountIdentifier",
            watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT ?
                ReceiverAccountIdentifierEnum.enum.NONE.toString() :
                (watchedIdentifier?.toString() || ReceiverAccountIdentifierEnum.enum.NONE.toString())
        );

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert(t('formSubmissionSuccess'));
            form.reset(defaultEmptyValues);
            // After reset, clear the selected file name from FileInputWithLabel
            // This would typically involve a ref to the FileInputWithLabel if it needs external reset,
            // but setting defaultEmptyValues for `qrCodeImage: null` should handle it via react-hook-form's reset.
            // If you have a custom display for the filename within FileInputWithLabel, ensure its state is reset too.
        }, 1500);
    };

    const selectedBankIsOther = watchedBankId && initialBanks.find(bank => bank.bankId === watchedBankId)?.bankName === "Other banks";

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto p-4 border rounded-lg shadow-md">
                <SelectWithLabel<ReceiverAccountSchemaType>
                    fieldTitle={t('receiverAccountType')}
                    nameInSchema="receiverAccountCategory"
                    data={useOrderedReceiverAccountCategories()} // Call the hook here
                    control={form.control}
                    placeholderHint={t('selectCategoryPlaceholder')}
                />
                {watchedCategory &&
                    <>
                        <InputWithLabel<ReceiverAccountSchemaType>
                            fieldTitle={t('accountName', { categoryName })}
                            nameInSchema="receiverAccountName"
                            control={form.control}
                            placeholder={t('accountNamePlaceholder', { categoryName })}
                        />

                        {(watchedCategory === ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT ||
                            watchedCategory === ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT) && (
                            <>
                                <SelectWithLabel<ReceiverAccountSchemaType>
                                    fieldTitle={t('receiverAccountIdentifier')}
                                    nameInSchema="receiverAccountIdentifier"
                                    data={receiverAccountIdentifiers} // This already uses next-intl
                                    control={form.control}
                                    placeholderHint={t('selectIdentifierPlaceholder')}
                                />
                                {watchedIdentifier === ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE && (
                                    <FileInputWithLabel<ReceiverAccountSchemaType>
                                        fieldTitle={t('qrCodeImage')}
                                        nameInSchema="qrCodeImage"
                                        control={form.control}
                                        imagePreview={qrCodePreview}
                                        accept=".jpg,.jpeg,.png,.webp"
                                    />
                                )}
                                {watchedIdentifier === ReceiverAccountIdentifierEnum.enum.EMAIL && (
                                    <InputWithLabel<ReceiverAccountSchemaType>
                                        fieldTitle={t('email')}
                                        nameInSchema="email"
                                        control={form.control}
                                        placeholder={t('emailPlaceholder')}
                                    />
                                )}
                                {watchedIdentifier === ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER && (
                                    <InputWithLabel<ReceiverAccountSchemaType>
                                        fieldTitle={t('phoneNumber')}
                                        nameInSchema="phoneNumber"
                                        control={form.control}
                                        placeholder={t('phoneNumberPlaceholder')}
                                    />
                                )}
                            </>
                        )}

                        {watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT && watchedReceiverAccountName != null && watchedReceiverAccountName != '' && (
                            <>
                                <Controller
                                    control={form.control}
                                    name="bankId"
                                    render={({ field }) => (
                                        <BankSelect
                                            {...field}
                                            banks={initialBanks}
                                            placeholderHint={t('selectBankPlaceholder')}
                                            onMenuStateChange={setIsBankSelectMenuOpen}
                                        />
                                    )}
                                />
                                {!isBankSelectMenuOpen && (
                                    <>
                                        {selectedBankIsOther && watchedBankId != null && (
                                            <InputWithLabel
                                                fieldTitle={t('bankName')}
                                                nameInSchema="bankName"
                                                control={form.control}
                                                placeholder={t('bankNamePlaceholder')}
                                            />
                                        )}
                                        {
                                            watchedBankId != null && <>
                                                <InputWithLabel
                                                    fieldTitle={t('cardHolderName')}
                                                    nameInSchema="cardHolderName"
                                                    control={form.control}
                                                    placeholder={t('cardHolderNamePlaceholder')}
                                                />
                                                <InputWithLabel
                                                    fieldTitle={t('bankAccountNumber')}
                                                    nameInSchema="bankAccountNumber"
                                                    control={form.control}
                                                    placeholder={t('bankAccountNumberPlaceholder')}
                                                />
                                            </>
                                        }
                                    </>
                                )}
                            </>
                        )}
                    </>
                }

                <div className="flex gap-2">
                    <Button type="submit" className="w-3/4" variant="default" title={t('addAccountButton')} disabled={loading}>
                        {loading ? t('addingAccountButton') : t('addAccountButton')}
                    </Button>
                    <Button type="button" className="w-1/2" variant="destructive" title={t('reset')} disabled={loading} onClick={() => form.reset(defaultEmptyValues)}>
                        { t('reset') }
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default AddReceiverAccountForm;