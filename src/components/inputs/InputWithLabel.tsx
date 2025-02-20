"use client"

import { useFormContext } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputHTMLAttributes } from "react"

type Props<S> = {   //Typescript generic, S may be T, we have used S to represent the schema that we pass in.
    fieldTitle: string,
    nameInSchema: keyof S & string,
    className?: string,
} & InputHTMLAttributes<HTMLInputElement>

export function InputWithLabel<S>({
    fieldTitle, nameInSchema, className, ...props
}: Props<S>) {
    const form = useFormContext()

    return (
        <FormField
        control={form.control}
        name={nameInSchema}
        render={({ field }) => (
            <FormItem>
                <FormLabel
                className="text-xl font-medium"
                htmlFor={nameInSchema}>
                    {fieldTitle}
                </FormLabel>

                <FormControl>
                    <Input
                    id={nameInSchema}
                    className={`w-full max-w-xs disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75 text-base placeholder:text-base  ${className}`}
                    {...props}
                    {...field}
                    />
                </FormControl>

                <FormMessage/>
            </FormItem>
        )} 
        />
    )
}