// src/components/form-controls/FileInputWithLabel.tsx
"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputHTMLAttributes } from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form";

type Props<S extends FieldValues> = {
    fieldTitle: string,
    nameInSchema: FieldPath<S>,
    className?: string,
    control: Control<S>,
    // Optional: To show a preview of the image
    imagePreview?: string | null;
    // Optional: Any other specific props for file input
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>; // Omit 'type' as it's always 'file'

export function FileInputWithLabel<S extends FieldValues>({
                                                              fieldTitle, nameInSchema, className, control, imagePreview, ...props
                                                          }: Props<S>) {
    return (
        <FormField
            control={control}
            name={nameInSchema}
            render={({ field: { value, onChange, ...fieldProps } }) => ( // Destructure value and onChange
                <FormItem>
                    <FormLabel
                        className="text-xl font-medium"
                        htmlFor={nameInSchema}>
                        {fieldTitle}
                    </FormLabel>

                    <FormControl>
                        <Input
                            id={nameInSchema}
                            type="file" // Always file type
                            className={`w-full max-w-xs text-base placeholder:text-base  ${className}`}
                            {...props}
                            {...fieldProps} // Pass remaining field props (e.g., onBlur, name)
                            onChange={(event) => {
                                // react-hook-form expects a FileList, but typically you want the first file
                                onChange(event.target.files ? event.target.files[0] : null);
                            }}
                            // Ensure the input value is cleared when no file is selected
                            value={''} // Clear the value of the input to allow re-selection of the same file
                        />
                    </FormControl>

                    {imagePreview && (
                        <div className="mt-2">
                            <img src={imagePreview} alt="QR Code Preview" className="max-w-xs h-auto rounded-md" />
                        </div>
                    )}

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}