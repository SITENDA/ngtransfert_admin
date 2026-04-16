// src/components/form-controls/FileInputWithLabel.tsx
"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input" // This Input component will be hidden
import { InputHTMLAttributes, useRef, useState } from "react" // Import useRef and useState
import { Control, FieldPath, FieldValues } from "react-hook-form";
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"; // Assuming you have a Shadcn Button component

// IMPORTANT: Omit 'type', 'value', and 'onChange' from InputHTMLAttributes,
// as we will control these manually for the hidden input.
type Props<S extends FieldValues> = {
    fieldTitle: string,
    nameInSchema: FieldPath<S>,
    className?: string,
    control: Control<S>,
    imagePreview?: string | null;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'>;

export function FileInputWithLabel<S extends FieldValues>({
                                                              fieldTitle, nameInSchema, className, control, imagePreview, ...props
                                                          }: Props<S>) {
    const t = useTranslations('AddReceiverAccountForm'); // Your actual namespace
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref to the native file input
    const [selectedFileName, setSelectedFileName] = useState<string>(''); // State to display the file name

    return (
        <FormField
            control={control}
            name={nameInSchema}
            render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="text-left">
                    <FormLabel
                        className="text-sm text-left font-medium"
                        htmlFor={nameInSchema}>
                        {fieldTitle}
                    </FormLabel>

                    <FormControl>
                        {/* Hidden native file input */}
                        {/* We use `Input` component but make it visually hidden */}
                        <Input
                            id={nameInSchema}
                            type="file"
                            className="hidden" // Hides the native input's UI
                            {...props}
                            {...fieldProps} // Pass react-hook-form field props (name, onBlur etc.)
                            ref={fileInputRef} // Attach the ref here to trigger it
                            onChange={(event) => {
                                const file = event.target.files ? event.target.files[0] : null;
                                // Pass the selected file (or null) to react-hook-form
                                onChange(file);
                                // Update local state for display purposes
                                setSelectedFileName(file ? file.name : '');

                                // Optional: To allow re-selection of the same file immediately after
                                // selection, you can reset the native input's value.
                                // This is often done after form submission or clearing.
                                // if (fileInputRef.current) {
                                //     fileInputRef.current.value = '';
                                // }
                            }}
                            // Do NOT set `value={''}` directly here.
                            // The native input's value is managed by the browser/react-hook-form's ref.
                        />
                    </FormControl>

                    {/* Custom visible input field */}
                    <div className="flex items-center space-x-2">
                        <Button
                            type="button" // Important: Prevents form submission when clicked
                            onClick={() => fileInputRef.current?.click()} // Programmatically click the hidden input
                            // You can add your desired button styling here
                            className="px-4 py-2"
                        >
                            {t('chooseFile')} {/* Translated button text */}
                        </Button>
                        <span className="text-sm text-gray-500">
                            {/* Display selected file name or translated "No file selected" */}
                            {selectedFileName || t('noFileSelected')}
                        </span>
                    </div>

                    {imagePreview && (
                        <div className="mt-2">
                            <Image
                                src={imagePreview}
                                alt={t('qrCodePreviewAlt')} // Translated alt text
                                width={200} // Set a fixed width for the preview
                                height={200} // Set a fixed height for the preview
                                style={{ objectFit: 'contain' }} // Maintain aspect ratio without cropping
                                className="max-w-xs h-auto rounded-md"
                            />
                        </div>
                    )}

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}