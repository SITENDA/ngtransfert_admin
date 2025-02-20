"use client";

import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheck, faInfoCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Ensure you have the necessary CSS for phone input
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Define the props interface
interface PhoneNumberInputProps {
    changeHandler: (value: string) => void;
    validPhoneNumber: boolean;
    value: string;
}

// Forward ref to the input field
export const PhoneNumberInput = forwardRef<HTMLInputElement, PhoneNumberInputProps>(
    ({ changeHandler, validPhoneNumber, value }, ref) => {
        // Determine colors based on theme
        const textColor =  "#ffffff";

        return (
            <div className="w-full flex flex-col gap-1">
                {/* Label with Validation Icons */}
                <div className="flex items-center justify-between">
                    <Label htmlFor="phoneNumber" style={{ color: textColor }}>
                        Phone Number
                    </Label>
                    <span className={cn("text-sm", value ? "block" : "hidden")}>
                        {validPhoneNumber ? (
                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                        ) : (
                            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                        )}
                    </span>
                </div>

                {/* Phone Input with Consistent Styling */}
                <div className="relative w-full">
                    <PhoneInput
                        // ref={ref}
                        country={"cn"}
                        placeholder="Phone Number"
                        countryCodeEditable={false}
                        inputStyle={{
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: 500,
                            height: "70px",
                            width: "100%"
                        }}
                        containerStyle={{
                            backgroundColor: "transparent",
                            border: "1px solid #1A1A1A",
                            boxShadow: "0 0 4px #191919",
                            height: "60px",
                            borderRadius: "8px",
                            fontFamily: "Inter, sans-serif",
                             marginBottom: "16px",
                        }}
                        buttonStyle={{
                            backgroundColor: "transparent",
                            border: "none",
                            borderRight: "1px solid #ccc",
                        }}
                        dropdownStyle={{
                            backgroundColor: "#444444",
                            color: "#ffffff",
                        }}
                        labelStyle={{
                            color: textColor,
                        }}
                        value={value}
                        onChange={changeHandler}
                        inputProps={{
                            required: true,
                            id: "phoneNumber",
                            name: "phoneNumber",
                            "aria-invalid": validPhoneNumber ? "false" : "true",
                            "aria-describedby": "phonenote",
                        }}
                        containerClass="w-full"
                        inputClass={cn(
                            "w-full rounded-md border px-3 py-2 text-base focus:ring-primary focus:border-primary",
                            !validPhoneNumber && "border-red-500 focus:border-red-500"
                        )}
                    />
                </div>

                {/* Validation Message */}
                <p className= {value && !validPhoneNumber ? "text-sm flex items-center gap-1 text-white-500 bg-black mt-1 p-1 w-11/12 rounded-md" : "absolute left-[-9999px]"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Valid phone numbers should be between 10 to 13 digits.
                </p>
            </div>
        );
    }
);

PhoneNumberInput.displayName = "PhoneNumberInput";
