"use client"

import { useFormContext } from "react-hook-form"
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
import {ReactNode} from "react";

// type DataObj = {
//     id: string,
//     description: string,
// }

type DataObj = {
    label: string,
    value: string,
    icon: ReactNode,
}

type Props<S> = {   //Typescript generic, S may be T, we have used S to represent the schema that we pass in.
    fieldTitle: string,
    nameInSchema: keyof S & string,
    data: DataObj[],
    className?: string,
}

export function SelectWithLabel<S>({
    fieldTitle, nameInSchema, data, className
}: Props<S>) {
    const form = useFormContext()

    return (
        <FormField
            control={form.control}
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
                                    className="flex items-center" // Add flex and alignment classes
                                >
                                    <span>{item.label}</span> {/* Wrap the label in a span */}
                                    {item.icon && <span className="ml-2">{item.icon}</span>} {/* Add margin-left */}
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
