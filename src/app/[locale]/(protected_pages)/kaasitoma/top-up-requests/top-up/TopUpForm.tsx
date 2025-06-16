// src/app/[locale]/(protected_pages)/kaasitoma/top-up-requests/top-up/TopUpForm.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { InputWithLabel } from "@/components/inputs/InputWithLabel"; // Assuming this path is correctly resolved
import { FileInputWithLabel } from "@/components/inputs/FileInputWithLabel"; // Assuming this path is correctly resolved
import { Button } from "@/components/ui/button"; // Assuming this path is correctly resolved
import { Form } from "@/components/ui/form"; // Assuming this is a context provider for react-hook-form

import { ReceiverAccount } from "../../../../../../../types/receiver-account"; // Import ReceiverAccount and its enums
import { topUpAccountBalanceAction } from "@/lib/actions/top-up-account";
import {
    ReceiverAccountCategoryEnum,
    ReceiverAccountCategoryType,
    ReceiverAccountIdentifierEnum
} from "@/zod-schemas/receiver-account"; // Import ReceiverAccountIdentifierEnum and ReceiverAccountCategoryEnum
import {RequestTopUpSchema, RequestTopUpSchemaType} from "@/zod-schemas/request-top-up-schema";
import {SelectWithLabel} from "@/components/inputs/SelectWithLabel";
import {useOrderedCountries} from "@/hooks/useOrderedCountries";
import {Country} from "../../../../../../../types/country";
import {undefined} from "zod";
import {TopUpMethodEnum} from "@/hooks/useOrderedTopUpMethods"; // Corrected import path for action

interface TopUpFormProps {
    initialCountries: Country[];
    initialReceiverAccount: ReceiverAccount;
}

const TopUpForm: React.FC<TopUpFormProps> = ({ initialCountries, initialReceiverAccount }) => {
    const t = useTranslations('TopUpForm'); // Translations for this component
    const router = useRouter();
    const locale = useLocale();

    // Helper function to map ReceiverAccountCategoryEnum to a translation key
    const getCategoryTranslationKey = (category: ReceiverAccountCategoryType): string => {
        switch (category) {
            case ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT:
                return 'alipay';
            case ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT:
                return 'wechat';
            case ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT:
                return 'bank';
            default:
                return ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT;
        }
    };

    // Filter and order countries for the SelectWithLabel
    const countryOptions = useOrderedCountries(initialCountries);


    // Determine the account identifier value based on the receiver account details
    const getAccountIdentifierValue = (account: ReceiverAccount): string => {
        switch (account.receiverAccountIdentifier) {
            case ReceiverAccountIdentifierEnum.enum.EMAIL:
                return account.email || '';
            case ReceiverAccountIdentifierEnum.enum.PHONE_NUMBER:
                return account.phoneNumber || '';
            case ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE:
                // For QR_CODE_IMAGE, use the account's name or ID as a string identifier
                return account.receiverAccountName || String(account.receiverAccountId) || '';
            case ReceiverAccountIdentifierEnum.enum.NONE: // For bank accounts
                return account.bankAccountNumber || '';
            default:
                return '';
        }
    };

    // Default form values for RequestTopUpSchemaType
    const defaultEmptyValues: RequestTopUpSchemaType = {
        receiverAccountCategory: initialReceiverAccount.receiverAccountCategory,
        accountIdentifier: getAccountIdentifierValue(initialReceiverAccount),
        accountId: initialReceiverAccount.receiverAccountId,
        currency: 'CNY',
        proofPicture: null,
        countryOfDepositId: undefined as unknown as number, // tricky, see below
        topUpMethod: TopUpMethodEnum.MOBILE_MONEY
        // amountInCNY omitted when undefined
        // sendingFee omitted when undefined
    };


    const form = useForm<RequestTopUpSchemaType>({
        mode: 'onBlur',
        resolver: zodResolver(RequestTopUpSchema),
        defaultValues: defaultEmptyValues,
    });

    const watchedProofPicture = form.watch("proofPicture"); // Watch for file input changes

    const [proofPicturePreview, setProofPicturePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Effect to create a preview URL for the selected proof picture
    useEffect(() => {
        if (watchedProofPicture instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofPicturePreview(reader.result as string);
            };
            reader.readAsDataURL(watchedProofPicture);
        } else {
            setProofPicturePreview(null);
        }
    }, [watchedProofPicture]);

    const onSubmit = async (data: RequestTopUpSchemaType) => {
        setLoading(true);
        console.log("DEBUG: TopUpForm - Form data prepared for submission:", data);

        // Manually construct FormData for the Server Action, as it expects FormData for file uploads
        const formData = new FormData();

        formData.append("receiverAccountType", data.receiverAccountCategory); // Matches Spring Boot @RequestParam
        formData.append("receiverAccountIdentifier", data.accountIdentifier); // Matches backend
        formData.append("receiverAccountId", data.accountId.toString()); // Matches backend
        formData.append("currency", data.currency); // Matches backend
        formData.append("amountInCNY", data.amountInCNY?.toString() || ''); // Matches backend
        formData.append("sendingFee", data.sendingFee?.toString() || '0'); // Matches backend

        // Handle the proof picture (MultipartFile)
        if (data.proofPicture instanceof File) {
            formData.append("proofPicture", data.proofPicture); // Matches backend
        }

        // Call the `topUpAccountBalanceAction` Server Action
        try {
            const result = await topUpAccountBalanceAction(formData);
            console.log("DEBUG: TopUpForm - Server action result:", result);

            if (result.success) {
                alert(t('topUpSuccessMessage', { message: result.message }));
                form.reset(defaultEmptyValues); // Reset form fields
                setProofPicturePreview(null); // Clear image preview
                // Redirect to the list of top-up requests or a success page
                router.push(`/${locale}/kaasitoma/top-up-requests`);
            } else {
                alert(`${t('submissionError')}: ${result.message}`);
                console.error('ERROR: Top-up request submission failed:', result.message);
            }
        } catch (error) {
            console.error("CRITICAL ERROR: TopUpForm - Exception during server action call:", error);
            alert(`${t('submissionError')}: An unexpected error occurred during submission.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Display immutable receiver account details */}

                {/* Country of Deposit Selector - Always Visible */}
                <SelectWithLabel<RequestTopUpSchemaType>
                    fieldTitle={t('countryOfDeposit')}
                    nameInSchema="countryOfDepositId"
                    data={countryOptions}
                    control={form.control}
                    placeholderHint={t('selectCountryPlaceholder')}
                />

                {/* Country of Deposit Selector - Always Visible */}
                <SelectWithLabel<RequestTopUpSchemaType>
                    fieldTitle={t('topUpMethod')}
                    nameInSchema="topUpMethod"
                    data={countryOptions}
                    control={form.control}
                    placeholderHint={t('selectTopUpMethodPlaceholder')}
                />

                {/* Amount in CNY */}
                <InputWithLabel<RequestTopUpSchemaType>
                    fieldTitle={t('amountInCNY')}
                    nameInSchema="amountInCNY"
                    control={form.control}
                    placeholder={t('amountInCNYPlaceholder')}
                    type="number"
                    step="0.01"
                />

                {/* Sending Fee */}
                <InputWithLabel<RequestTopUpSchemaType>
                    fieldTitle={t('sendingFee')}
                    nameInSchema="sendingFee"
                    control={form.control}
                    placeholder={t('sendingFeePlaceholder')}
                    type="number"
                    step="0.01"
                />

                {/* Proof Picture Upload */}
                <FileInputWithLabel<RequestTopUpSchemaType>
                    fieldTitle={t('proofPicture')}
                    nameInSchema="proofPicture"
                    control={form.control}
                    imagePreview={proofPicturePreview}
                    accept=".jpg,.jpeg,.png,.webp"
                />

                <div className="flex gap-2 justify-end">
                    <Button type="submit" className="w-1/2" disabled={loading}>
                        {loading ? t('submittingTopUp') : t('submitTopUp')}
                    </Button>
                    <Button type="button" variant="outline" className="w-1/2" disabled={loading} onClick={() => {
                        form.reset(defaultEmptyValues);
                        setProofPicturePreview(null); // Clear preview on reset
                    }}>
                        {t('reset')}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TopUpForm;
