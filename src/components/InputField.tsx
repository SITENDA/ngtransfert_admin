"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    errorMessage?: string;
    validate?: (value: string) => boolean;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, errorMessage, validate, className, value, onChange, onFocus, onBlur, type = "text", ...props }, ref) => {
        const isValid = validate ? validate(value as string) : true; // Custom validation function
        const showValidation = value !== ""; // Show icons only if input has text

        return (
            <div className="w-full flex flex-col gap-1">
                {/* Label with Validation Icons */}
                <div className="flex items-center justify-between">
                    <Label htmlFor={props.id || type}>{label}</Label>
                    <span className={cn("text-sm", showValidation ? "block" : "hidden")}>
                        {isValid ? (
                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : (
                            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        )}
                    </span>
                </div>

                {/* Input Field */}
                <Input
                    id={props.id || type}
                    type={type}
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className={cn(
                        "border-gray-300 focus:ring-primary focus:border-primary",
                        (value && !isValid) && "border-red-500 focus:border-red-500",
                        className
                    )}
                    {...props}
                />

                 {/*Error Message*/}
                {value && errorMessage && !isValid && (
                    <p className="text-sm flex items-center gap-1 text-white-500 bg-black mt-1 p-1 w-11/12 rounded-md">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        {errorMessage}
                    </p>
                )}
            </div>
        );
    }
);

InputField.displayName = "InputField";