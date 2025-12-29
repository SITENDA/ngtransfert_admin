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
import { useOrderedReceiverAccountCategories } from "@/hooks/ReceiverAccountType";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { FileInputWithLabel } from "@/components/inputs/FileInputWithLabel";
import {Bank} from "../../../../../../../types/bank";
import {useLocale, useTranslations} from 'next-intl';
import {useReceiverAccountIdentifiers} from "@/hooks/ReceiverAccountIdentifier";
import {createReceiverAccountAction} from "@/lib/actions/createReceiverAccountAction";
import { useRouter } from 'next/navigation';
import {BankSelect} from "@/components/BankSelect";
import { PhoneNumberInput } from "@/components/PhoneNumberInput";
import { useToast } from "@/hooks/use-toast";
import TickAnimation from "@/components/TickAnimation";
import { kaasitomaPaths } from "@/util/frontend-paths";



interface AddReceiverAccountFormProps {
    initialBanks: Bank[];
    clientId: number;
}

const AddReceiverAccountForm: React.FC<AddReceiverAccountFormProps> = ({ initialBanks, clientId }) => {

    const t = useTranslations('AddReceiverAccountForm');
    const receiverAccountIdentifiers = useReceiverAccountIdentifiers();
    const receiverAccountCategories = useOrderedReceiverAccountCategories();
    const { toast } = useToast();

    const router = useRouter();
    const locale = useLocale();

    const defaultEmptyValues: ReceiverAccountSchemaType = {
        receiverAccountName: '',
        receiverAccountCategory: null,
        clientId: clientId,
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
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.BANK_ACCOUNT_NUMBER, { shouldValidate: true });
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

    const handlePhoneChange = (
        value: string,
        onChange: (value: string) => void
    ) => {
        onChange(value);

        const digits = value.replace(/\D/g, "");
        setValidPhoneNumber(digits.length >= 10 && digits.length <= 13);
    };

    // Handle form submission using the Server Action
    const onSubmit = async (data: ReceiverAccountSchemaType) => {
        setLoading(true); // Start loading state
        console.log("Form data prepared for submission:", data);

        // Manually construct FormData for the Server Action.
        // Field names must match the `@RequestParam` names in your Spring Boot controller.
        const formData = new FormData();

        formData.append("receiverAccountName", data.receiverAccountName);
        formData.append("receiverAccountType", data.receiverAccountCategory || ''); // Ensure enum value is a string
        formData.append("clientId", clientId.toString()); // Convert number to string
        formData.append("receiverAccountIdentifier", data.receiverAccountIdentifier || ''); // Ensure enum value is a string

        // Handle the QR code image (MultipartFile).
        if (data.qrCodeImage instanceof File) {
            formData.append("qrCodeImage", data.qrCodeImage);
        } else {
            // If `qrCodeImage` is not a File object, and your Spring Boot `@RequestParam`
            // for `MultipartFile` is not optional (`@Nullable` or `Optional<MultipartFile>`),
            // you might need to send an empty Blob as a placeholder to prevent a missing parameter error.
            // If your backend handles missing `MultipartFile` parameters gracefully, this `else` block
            // can be omitted, or you can send an empty Blob like below if needed:
            // formData.append("qrCodeImage", new Blob([]), "empty.txt");
        }

        // Append other optional fields, converting null/undefined to empty strings for consistency
        formData.append("email", data.email || '');
        formData.append("phoneNumber", data.phoneNumber || '');
        formData.append("bankAccountNumber", data.bankAccountNumber?.toString() || ''); // Convert number to string
        formData.append("bankId", data.bankId?.toString() || ''); // Convert number to string
        formData.append("countryId", data.countryId?.toString() || ''); // Convert number to string
        formData.append("cardHolderName", data.cardHolderName || '');
        formData.append("bankName", data.bankName || '');

        console.log("formData : ", formData);

        // Call the `createReceiverAccountAction` Server Action
        const result = await createReceiverAccountAction(formData);

        setLoading(false); // End loading state

        if (!result.success) {
            toast({
                title: t("error"),
                description: result.message ?? t("submissionError"),
                variant: "destructive",
            });
            return;
        }

        toast({
            title: t("success"),
            description: result.message,
        });

        setSuccessMessage(result.message ?? t("success"));
        form.reset(defaultEmptyValues);
        setQrCodePreview(null);

// ⏳ Redirect AFTER animation (3s)
        setTimeout(() => {
            router.push(
                `/${locale}${kaasitomaPaths.receiverAccountsPath}`
            );
        }, 3000);

    };

    const selectedBankIsOther = watchedBankId && initialBanks.find(bank => bank.bankId === watchedBankId)?.bankName === "Other banks";

    if (successMessage) {
        return <TickAnimation successMessage={successMessage} />;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto p-4 border rounded-lg shadow-md">
                <SelectWithLabel<ReceiverAccountSchemaType>
                    fieldTitle={t('receiverAccountType')}
                    nameInSchema="receiverAccountCategory"
                    data={receiverAccountCategories} // Call the hook here
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
                                    <Controller
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <div className="space-y-1">
                                                <PhoneNumberInput
                                                    value={field.value ?? ""}
                                                    changeHandler={(val) =>
                                                        handlePhoneChange(val, field.onChange)
                                                    }
                                                    validPhoneNumber={validPhoneNumber}
                                                />
                                            </div>
                                        )}
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
                                            banks={initialBanks}
                                            value={field.value}
                                            onChangeAction={field.onChange}
                                            placeholder={t("selectBankPlaceholder")}
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