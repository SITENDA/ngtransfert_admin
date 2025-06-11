// src/app/[locale]/(protected_pages)/kaasitoma/add-receiver-account/AddReceiverAccountForm.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { Controller, useForm } from "react-hook-form"; // Import Controller
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
import BankSelect from "@/components/BankSelect";

// Placeholder components - these remain if they are used elsewhere
// or are simple wrappers around InputWithLabel.
// BankNameInput will be conditionally rendered based on selected bank.
const BankNameInput = ({ control, nameInSchema, ...props }: any) => (
    <InputWithLabel fieldTitle="Bank Name" nameInSchema={nameInSchema} control={control} placeholder="e.g., Industrial and Commercial Bank of China" {...props} />
);
const CardHolderNameInput = ({ control, nameInSchema, ...props }: any) => (
    <InputWithLabel fieldTitle="Card Holder Name" nameInSchema={nameInSchema} control={control} placeholder="e.g., John Doe" {...props} />
);
const BankAccountNumberInput = ({ control, nameInSchema, ...props }: any) => (
    <InputWithLabel fieldTitle="Bank Account Number" nameInSchema={nameInSchema} control={control} placeholder="e.g., 1234567890" {...props} />
);

// Define the props for AddReceiverAccountForm, including initialBanks
interface AddReceiverAccountFormProps {
    initialBanks: Bank[]; // The banks data passed from the Server Component
}

const AddReceiverAccountForm: React.FC<AddReceiverAccountFormProps> = ({ initialBanks }) => {
    // const router = useRouter(); // For Next.js navigation

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
    const watchedBankId = form.watch("bankId"); // Watch for changes in bankId
    const [categoryName, setCategoryName] = useState<string>('Receiver');

    // State for image preview URL
    const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // For submission loading state

    // Simulate current user ID (replace with actual auth context)
    const currentUser = { userId: 123 }; // Replace with actual user context/store

    // Effect to set clientId from currentUser
    useEffect(() => {
        if (currentUser?.userId) {
            form.setValue("clientId", currentUser.userId, { shouldValidate: true });
        }
    }, [currentUser?.userId, form]);

    // Effect to set bankName and countryId based on the selected bank from initialBanks
    useEffect(() => {
        if (watchedBankId !== null && watchedBankId !== undefined) {
            const selectedBank = initialBanks.find(bank => bank.bankId === watchedBankId);
            if (selectedBank) {
                // If "Other banks" is selected, clear bankName so the user can type
                form.setValue("bankName", selectedBank.bankName === "Other banks" ? "" : selectedBank.bankName, { shouldValidate: true });
                // Set countryId from the selected bank's country object
                if (selectedBank.country && selectedBank.country.countryId) {
                    form.setValue("countryId", selectedBank.country.countryId, { shouldValidate: true });
                } else {
                    form.setValue("countryId", null, { shouldValidate: true });
                }
            }
        } else {
            // Clear bankName and countryId if no bank is selected or bankId is null/undefined
            form.setValue("bankName", "", { shouldValidate: true });
            form.setValue("countryId", null, { shouldValidate: true });
        }
    }, [watchedBankId, initialBanks, form]);


    // Effect to set default identifier when category changes to Alipay/WeChat
    useEffect(() => {
        if (watchedCategory === ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT ||
            watchedCategory === ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT) {
            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.QR_CODE_IMAGE, { shouldValidate: true });
            if (watchedCategory === ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT) {
                setCategoryName("Alipay");
            } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT) {
                setCategoryName("Wechat");
            }
            // Clear bank-related fields when switching to Alipay/WeChat
            form.setValue("bankAccountNumber", "");
            form.setValue("bankId", null);
            form.setValue("countryId", null);
            form.setValue("cardHolderName", "");
            form.setValue("bankName", "");
        } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT) {
            setCategoryName("Bank");
            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.NONE, { shouldValidate: true });
            // Clear QR, email, phone fields when switching to Bank Account
            form.setValue("email", "");
            form.setValue("phoneNumber", "");
            form.setValue("qrCodeImage", null);
            setQrCodePreview(null);
        } else {
            // If category is null (placeholder state), reset all conditional fields
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
            setCategoryName('Receiver'); // Reset category name
        }
    }, [watchedCategory, form]);

    // Effect to update image preview when qrCodeImage changes
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
        // Append all fields to FormData, handling nulls/undefineds
        Object.keys(data).forEach(key => {
            const value = data[key as keyof ReceiverAccountSchemaType];
            // Exclude null, undefined, empty string for most fields
            // For File inputs, specifically check instanceof File
            if (value !== null && value !== undefined && (typeof value !== 'string' || value !== '')) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === 'number' || typeof value === 'boolean') {
                    formData.append(key, value.toString());
                } else if (typeof value === 'object' && value !== null) {
                    // This handles potential nested objects, but ensure they are serializable if needed
                    // For example, if 'countryId' was part of a 'country' object, you'd handle it.
                    // For flat schema, this might not be strictly necessary, but good for robustness.
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value as string);
                }
            }
        });

        // Specific handling for receiverAccountIdentifier based on your Java DTO
        // Ensure enum values are converted to string for FormData
        formData.set("receiverAccountIdentifier",
            watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT ?
                ReceiverAccountIdentifierEnum.enum.NONE.toString() :
                (watchedIdentifier?.toString() || ReceiverAccountIdentifierEnum.enum.NONE.toString())
        );

        // Your createReceiverAccount mutation call would go here
        // try {
        //     const response = await createReceiverAccount(formData).unwrap();
        //     if (response?.statusCode === 200 && response?.message === "Receiver account created successfully") {
        //         form.reset(defaultEmptyValues);
        //         // router.push(clientPaths.receiverAccountsPath);
        //     }
        // } catch (error) {
        //     console.error('Error creating receiver account:', error);
        // } finally {
        //     setLoading(false);
        // }

        // Mock success for now:
        setTimeout(() => {
            setLoading(false);
            alert("Form submitted successfully! (Mocked)");
            form.reset(defaultEmptyValues);
            // router.push(clientPaths.receiverAccountsPath);
        }, 1500);
    };

    // Find the "Other banks" option to determine if BankNameInput should be shown
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

                {/* Receiver Account Name (always visible if category selected) */}
                {watchedCategory && (
                    <InputWithLabel<ReceiverAccountSchemaType>
                        fieldTitle={`${categoryName} Account Name`}
                        nameInSchema="receiverAccountName"
                        control={form.control}
                        placeholder={`e.g., My ${categoryName} Account`}
                    />
                )}

                {/* Conditional fields based on selected Category */}
                {(watchedCategory === ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT ||
                    watchedCategory === ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT) && (
                    <div className="space-y-4 border p-3 rounded-md">
                        <h3 className="text-lg font-semibold">Account Identification</h3>
                        {/* Display correct identifier input based on watchedIdentifier */}
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

                        {/* Buttons to change identifier type */}
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
                {watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT && (
                    <div className="space-y-4 border p-3 rounded-md">
                        <h3 className="text-lg font-semibold">Bank Account Details</h3>
                        {/* Use Controller for BankSelect */}
                        <Controller
                            control={form.control}
                            name="bankId" // This matches the field in your Zod schema
                            render={({ field }) => (
                                <BankSelect
                                    {...field} // Provides onChange, onBlur, value, ref
                                    banks={initialBanks} // Pass the fetched banks here
                                    placeholderHint="Select a Bank"
                                />
                            )}
                        />
                        {/* Conditionally render BankNameInput if "Other banks" is selected */}
                        {selectedBankIsOther && (
                            <BankNameInput
                                nameInSchema="bankName"
                                control={form.control}
                            />
                        )}
                        <CardHolderNameInput
                            nameInSchema="cardHolderName"
                            control={form.control}
                        />
                        <BankAccountNumberInput
                            nameInSchema="bankAccountNumber"
                            control={form.control}
                        />
                    </div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Adding account...' : 'Add Account'}
                </Button>
            </form>
        </Form>
    );
};

export default AddReceiverAccountForm;