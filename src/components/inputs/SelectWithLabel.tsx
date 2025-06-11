"use client"

import { FieldValues, FieldPath, Control } from "react-hook-form" // Import FieldValues here
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

// --- IMPORTANT: Add `extends FieldValues` to the generic type S ---
type Props<S extends FieldValues> = {   //Typescript generic, S may be T, we have used S to represent the schema that we pass in.
    fieldTitle: string,
    nameInSchema: FieldPath<S>, // Or FieldPath<S> for more precision, as in InputWithLabel
    data: DataObj[],
    className?: string,
    control: Control<S>,
}

// --- Add `extends FieldValues` to the function's generic parameter definition ---
export function SelectWithLabel<S extends FieldValues>({
                                                           fieldTitle, nameInSchema, data, className, control
                                                       }: Props<S>) {

    return (
        <FormField
            control={control} // form.control is now correctly typed as Control<S>
            name={nameInSchema}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className="text-xl"
                        htmlFor={nameInSchema}>
                        {fieldTitle}
                    </FormLabel>

                    <Select
                        {...field}
                        onValueChange={field.onChange}
                    >
                        <FormControl>
                            <SelectTrigger
                                id={nameInSchema}
                                className={`w-full max-w-xs ${className}`}>
                                <SelectValue placeholder="Select" />
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