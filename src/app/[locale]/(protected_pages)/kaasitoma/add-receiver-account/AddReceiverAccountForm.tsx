"use client"

import React, { useEffect, useState } from 'react';
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
    ReceiverAccountCategoryEnum,
    ReceiverAccountIdentifierEnum,
    ReceiverAccountSchema,
    ReceiverAccountSchemaType
} from "@/zod-schemas/receiver-account"; // Updated path
import { zodResolver } from "@hookform/resolvers/zod";
import { orderedReceiverAccountTypes } from "@/constants/ReceiverAccountType"; // Updated path
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { FileInputWithLabel } from "@/components/inputs/FileInputWithLabel"; // New import
// import { useGetBankByIdQuery } from '@/services/banks'; // Assuming you have an RTK Query hook for banks
// import { clientPaths } from '@/constants/frontend'; // Adjust path if needed
// import { useRouter } from 'next/navigation'; // For Next.js navigation

// Assuming you have components for BankSelector, BankNameInput, CardHolderNameInput, BankAccountNumberInput
// and they are adapted to use react-hook-form (i.e., accept control and nameInSchema)
// Placeholder for BankSelector etc if they are not yet migrated to RHF pattern:
const BankSelector = ({ control, nameInSchema, placeholderHint, ...props }: any) => (
    <InputWithLabel fieldTitle="Select Bank" nameInSchema={nameInSchema} control={control} placeholder={placeholderHint} {...props} />
);
// const BankNameInput = ({ control, nameInSchema, ...props }: any) => (
//     <InputWithLabel fieldTitle="Bank Name" nameInSchema={nameInSchema} control={control} placeholder="e.g., Industrial and Commercial Bank of China" {...props} />
// );
const CardHolderNameInput = ({ control, nameInSchema, ...props }: any) => (
    <InputWithLabel fieldTitle="Card Holder Name" nameInSchema={nameInSchema} control={control} placeholder="e.g., John Doe" {...props} />
);
const BankAccountNumberInput = ({ control, nameInSchema, ...props }: any) => (
    <InputWithLabel fieldTitle="Bank Account Number" nameInSchema={nameInSchema} control={control} placeholder="e.g., 1234567890" {...props} />
);


const AddReceiverAccountForm = () => {
    // const router = useRouter(); // For Next.js navigation

    const defaultEmptyValues: ReceiverAccountSchemaType = {
        receiverAccountName: '',
        receiverAccountCategory: null, // Start with null to show the placeholder
        clientId: undefined, // Will be set by useEffect, or remove if always server-side
        receiverAccountIdentifier: null, // Will be set conditionally based on category
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
    const [categoryName, setCategoryName] = useState<string>('Receiver');
    // const watchedBankId = form.watch("bankId");

    // State for image preview URL
    const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // For submission loading state

    // Simulate current user ID (replace with actual auth context)
    const currentUser = { userId: 123 }; // Replace with actual user context/store

    // Fetch bank data using RTK Query based on selectedBankId from form
    // const { data: bankData } = useGetBankByIdQuery(watchedBankId!, {
    //     skip: !watchedBankId || watchedBankId <= 0, // Skip query if no bankId selected
    // });

    // Effect to set clientId from currentUser
    useEffect(() => {
        if (currentUser?.userId) {
            form.setValue("clientId", currentUser.userId, { shouldValidate: true });
        }
    }, [currentUser?.userId, form]);

    // Effect to set bankName if a bank is fetched
    // useEffect(() => {
    //     if (bankData && watchedBankId && bankData.bankName !== "Other banks") {
    //         form.setValue("bankName", bankData.bankName, { shouldValidate: true });
    //     } else if (bankData?.bankName === "Other banks") {
    //         // If "Other banks" is selected, clear bankName so user can type
    //         form.setValue("bankName", "", { shouldValidate: true });
    //     }
    // }, [bankData, watchedBankId, form]);

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
        } else if (watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT) {
            setCategoryName("Bank");
            form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.NONE, { shouldValidate: true });
            // For bank, no identifier needed like QR/Email/Phone. Set to NONE or null
            // You might want to clear other identifier fields here
            form.setValue("email", "");
            form.setValue("phoneNumber", "");
            form.setValue("qrCodeImage", null);
            setQrCodePreview(null);
        } else {
            // If category is null (placeholder state), reset identifier and related fields
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
            if (value !== null && value !== undefined && value !== "") { // Exclude null, undefined, empty string
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === 'number' || typeof value === 'boolean') {
                    formData.append(key, value.toString());
                } else if (typeof value === 'object' && value !== null) {
                    // Handle nested objects if any, though your schema doesn't have them
                    formData.append(key, JSON.stringify(value));
                }
                else {
                    formData.append(key, value as string);
                }
            }
        });

        // Specific handling for receiverAccountIdentifier based on your Java DTO
        // If bank, identifier is NONE. Otherwise, use selected.
        formData.set("receiverAccountIdentifier",
            watchedCategory === ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT ?
                ReceiverAccountIdentifierEnum.enum.NONE :
                (watchedIdentifier || ReceiverAccountIdentifierEnum.enum.NONE)
        );

        // Your createReceiverAccount mutation call
        // try {
        //     const response = await createReceiverAccount(formData).unwrap();
        //     if (response?.statusCode === 200 && response?.message === "Receiver account created successfully") {
        //         // setTickAnimationVisible(true); // You'd integrate this
        //         form.reset(defaultEmptyValues); // Reset form to default empty values
        //         // router.push(clientPaths.receiverAccountsPath); // Navigate
        //     }
        // } catch (error) {
        //     console.error('Error creating receiver account:', error);
        //     // Handle error, e.g., show a toast
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
                {watchedCategory && ( // Only show if a category is selected
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
                                    type="button" // Important: type="button" to prevent form submission
                                    variant="link"
                                    onClick={() => {
                                        form.setValue("receiverAccountIdentifier", ReceiverAccountIdentifierEnum.enum.EMAIL, { shouldValidate: true });
                                        form.setValue("qrCodeImage", null); // Clear other identifier fields
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
                                        form.setValue("qrCodeImage", null); // Clear other identifier fields
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
                                        form.setValue("email", ""); // Clear other identifier fields
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
                        <BankSelector
                            nameInSchema="bankId"
                            control={form.control}
                            placeholderHint="Select a Bank" // Adjust as needed
                            // You might need a `countryId` selector here too if your backend requires it
                        />
                        {/* Conditionally render BankNameInput if "Other banks" is selected from BankSelector */}
                        {/*{bankData?.bankName === "Other banks" && (*/}
                        {/*    <BankNameInput*/}
                        {/*        nameInSchema="bankName"*/}
                        {/*        control={form.control}*/}
                        {/*    />*/}
                        {/*)}*/}
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