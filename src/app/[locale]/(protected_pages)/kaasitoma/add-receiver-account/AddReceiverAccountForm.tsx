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
import { useOrderedReceiverAccountTypes } from "@/constants/ReceiverAccountType";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { FileInputWithLabel } from "@/components/inputs/FileInputWithLabel";
import {Bank} from "../../../../../../types/bank";
import BankSelect from "@/components/BankSelect";
import { useTranslations } from 'next-intl';

interface AddReceiverAccountFormProps {
    initialBanks: Bank[];
}

const AddReceiverAccountForm: React.FC<AddReceiverAccountFormProps> = ({ initialBanks }) => {
    const t = useTranslations('AddReceiverAccountForm');

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
    const [categoryName, setCategoryName] = useState<string>(''); // Initialize with empty string, will be set in useEffect

    const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isBankSelectMenuOpen, setIsBankSelectMenuOpen] = useState(false);

    const currentUser = { userId: 123 };

    useEffect(() => {
        if (currentUser?.userId) {
            form.setValue("clientId", currentUser.userId, { shouldValidate: true });
        }
    }, [currentUser?.userId, form]);

    // NEW useEffect for translating and setting categoryName
    useEffect(() => {
        if (watchedCategory === ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT) {
            setCategoryName(t('alipay'));
        } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT) {
            setCategoryName(t('wechat'));
        } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT) {
            setCategoryName(t('bank'));
        } else {
            setCategoryName(t('receiver')); // Default or unset state
        }
    }, [watchedCategory, t]); // Dependencies: watchedCategory and the translation function 't'


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

    // Original useEffect for form logic and resets - REMOVE setCategoryName calls from here
    useEffect(() => {
        if (watchedCategory === ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT ||
            watchedCategory === ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT) {
            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE, { shouldValidate: true });
            // Removed setCategoryName("Alipay"); and setCategoryName("Wechat");
            form.setValue("bankAccountNumber", "");
            form.setValue("bankId", null);
            form.setValue("countryId", null);
            form.setValue("cardHolderName", "");
            form.setValue("bankName", "");
        } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT) {
            // Removed setCategoryName("Bank");
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
            // Removed setCategoryName('Receiver');
        }
    }, [watchedCategory, form]); // Keep 'form' as a dependency as it's used for setValue

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
            alert(t('formSubmissionSuccess'));
            form.reset(defaultEmptyValues);
        }, 1500);
    };

    const selectedBankIsOther = watchedBankId && initialBanks.find(bank => bank.bankId === watchedBankId)?.bankName === "Other banks";

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto p-4 border rounded-lg shadow-md">
                <SelectWithLabel<ReceiverAccountSchemaType>
                    fieldTitle={t('receiverAccountType')}
                    nameInSchema="receiverAccountCategory"
                    data={useOrderedReceiverAccountTypes()} // Call the hook here
                    control={form.control}
                    placeholderHint={t('selectPlaceholder')}
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
                            <div className="space-y-4 border p-3 rounded-md">
                                <h3 className="text-lg font-semibold">{t('accountIdentification')}</h3>
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
                                            {t('useEmailInstead')}
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
                                            {t('usePhoneNumberInstead')}
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
                                            {t('useQrCodeInstead')}
                                        </Button>
                                    )}
                                </div>
                            </div>
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

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('addingAccountButton') : t('addAccountButton')}
                </Button>
            </form>
        </Form>
    );
};

export default AddReceiverAccountForm;