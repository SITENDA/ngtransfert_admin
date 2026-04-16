"use client";

import { FieldValues, FieldPath, Control } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { ReactNode } from "react";

type DataObj = {
    label: string;
    value: string;
    icon?: ReactNode;
};

type Props<T extends FieldValues> = {
    fieldTitle: string;
    nameInSchema: FieldPath<T>;   // ✅ strongly typed
    data: DataObj[];
    className?: string;
    control: Control<T>;          // ✅ strongly typed
    placeholderHint?: string;
};

export function SelectWithLabel<T extends FieldValues>({
                                                           fieldTitle,
                                                           nameInSchema,
                                                           data,
                                                           className,
                                                           control,
                                                           placeholderHint = "Select an option",
                                                       }: Props<T>) {
    return (
        <FormField
            control={control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className="text-left">
                    <FormLabel className="text-sm text-left">
                        {fieldTitle}
                    </FormLabel>

                    <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                    >
                        <FormControl>
                            <SelectTrigger
                                className={`w-full max-w-xs ${className}`}
                            >
                                <SelectValue placeholder={placeholderHint} />
                            </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                            {data.map((item) => (
                                <SelectItem
                                    key={`${String(nameInSchema)}_${item.value}`}
                                    value={item.value}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>{item.label}</span>
                                        {item.icon && <span>{item.icon}</span>}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                        {/*<SelectContent>*/}
                        {/*    {data.map(item => (*/}
                        {/*        <SelectItem*/}
                        {/*            key={`${nameInSchema}_${item.value}`}*/}
                        {/*            value={item.value}*/}
                        {/*            className="flex items-center"*/}
                        {/*        >*/}
                        {/*            <span>{item.label}</span>*/}
                        {/*            {item.icon && <span className="ml-2">{item.icon}</span>}*/}
                        {/*        </SelectItem>*/}
                        {/*    ))}*/}
                        {/*</SelectContent>*/}
                    </Select>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}