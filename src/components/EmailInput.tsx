"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    errorMessage?: string;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
    ({ label = "Email", errorMessage, className, value, onChange, onFocus, onBlur, ...props }, ref) => {
        const isValidEmail = value && /\S+@\S+\.\S+/.test(value as string); // Regex for valid email
        const showValidation = value !== ""; // Only show validation icons if user has typed

        return (
            <div className="w-full flex flex-col gap-1">
                {/* Label with Validation Icons */}
                <div className="flex items-center justify-between">
                    <Label htmlFor={props.id || "email"}>{label}</Label>
                    <span className={cn("text-sm", showValidation ? "block" : "hidden")}>
            {isValidEmail ? (
                <FontAwesomeIcon icon={faCheck} className="text-green-500" />
            ) : (
                <FontAwesomeIcon icon={faTimes} className="text-red-500" />
            )}
          </span>
                </div>

                {/* Input Field */}
                <Input
                    id={props.id || "email"}
                    type="email"
                    placeholder="Enter your email"
                    ref={ref}
                    value={value} // Controlled component value
                    onChange={onChange} // Controlled component onChange
                    onFocus={onFocus} // New onFocus event handler
                    onBlur={onBlur} // New onBlur event handler
                    className={cn(
                        "border-gray-300 focus:ring-primary focus:border-primary",
                        errorMessage && "border-red-500 focus:border-red-500",
                        className
                    )}
                    {...props}
                />

                {/* Error Message & Instructions */}
                <p
                    className={cn(
                        "text-sm flex items-center gap-1",
                        showValidation && !isValidEmail ? "text-red-500 mt-1" : "hidden"
                    )}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Please enter a valid email address.
                </p>
            </div>
        );
    }
);

EmailInput.displayName = "EmailInput";
