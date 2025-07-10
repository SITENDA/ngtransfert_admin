"use client"

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputHTMLAttributes } from "react"
import {Control, FieldPath, FieldValues} from "react-hook-form"; // Import FieldValues here

// --- IMPORTANT: Add `extends FieldValues` to the generic type S ---
type Props<S extends FieldValues> = { // S must extend FieldValues
    fieldTitle: string,
    // Using `FieldPath<S>` from 'react-hook-form' here would be even more precise,
    // but `keyof S & string` also works if `S` is correctly constrained.
    nameInSchema: FieldPath<S>,
    className?: string,
    control: Control<S>,
} & InputHTMLAttributes<HTMLInputElement>

export function InputWithLabel<S extends FieldValues>({ // S must extend FieldValues here too
                                                          fieldTitle, nameInSchema, className, control, ...props
                                                      }: Props<S>) {
    return (
        <FormField
            control={control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className="text-left">
                    <FormLabel
                        className="text-left text-sm"
                        htmlFor={nameInSchema}>
                        {fieldTitle}
                    </FormLabel>

                    <FormControl>
                        <Input
                            id={nameInSchema}
                            className={`w-full max-w-xs disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75 text-base placeholder:text-sm  ${className}`}
                            {...props}
                            {...field}
                            value={field.value ?? ''}
                        />
                    </FormControl>

                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}