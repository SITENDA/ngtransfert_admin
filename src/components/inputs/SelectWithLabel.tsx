"use client"

import { FieldValues, FieldPath, Control } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { ReactNode } from "react";

type DataObj = {
    label: string,
    value: string,
    icon?: ReactNode, // Make icon optional if it might not always be present
}

type Props<S extends FieldValues> = {
    fieldTitle: string,
    nameInSchema: FieldPath<S>,
    data: DataObj[],
    className?: string,
    control: Control<S>,
    placeholderHint?: string; // New prop for the placeholder hint
}

export function SelectWithLabel<S extends FieldValues>({
                                                           fieldTitle,
                                                           nameInSchema,
                                                           data,
                                                           className,
                                                           control,
                                                           placeholderHint = "Select an option", // Default placeholder hint
                                                       }: Props<S>) {

    // No need for processedData or allOption logic here, as we're not adding an "All" item

    return (
        <FormField
            control={control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className="text-left">
                    <FormLabel
                        className="text-sm text-left"
                        htmlFor={nameInSchema}>
                        {fieldTitle}
                    </FormLabel>

                    <Select
                        {...field}
                        onValueChange={field.onChange}
                        // Important: Ensure the value is correctly passed and null/undefined for placeholder
                        value={field.value || ""} // If field.value is null/undefined, set it to "" for Select component
                    >
                        <FormControl>
                            <SelectTrigger
                                id={nameInSchema}
                                className={`w-full max-w-xs ${className}`}>
                                {/* Use the placeholderHint prop here */}
                                <SelectValue placeholder={placeholderHint} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {data.map(item => (
                                <SelectItem
                                    key={`${nameInSchema}_${item.value}`}
                                    value={item.value}
                                    className="flex items-center"
                                >
                                    <span>{item.label}</span>
                                    {item.icon && <span className="ml-2">{item.icon}</span>}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}