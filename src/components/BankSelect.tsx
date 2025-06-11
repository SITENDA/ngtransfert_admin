// src/components/banks/BankSelect.tsx
"use client";

import React, { forwardRef, useMemo } from 'react';
import Select from 'react-select';
import { useTheme } from 'next-themes'; // Import useTheme from next-themes

import CountryFlag from '@/components/CountryFlag'; // Adjust path as needed
import ImageDisplay from '@/components/ImageDisplay'; // Adjust path as needed

import BankLogo from "@/components/BankLogo";
import {Bank} from "../../types/bank"; // Your Bank interface

// Define props for BankSelect to integrate with react-hook-form's Controller
interface BankSelectProps {
    banks: Bank[]; // The list of banks passed from the parent component
    value?: number | null; // The selected bankId from react-hook-form
    onChange: (bankId: number | null) => void; // Function to update react-hook-form value
    onBlur: () => void; // Function to signal blur to react-hook-form
    name: string; // The name of the field in the form schema (e.g., "bankId")
    ref: React.Ref<any>; // Ref for the Select component
    placeholderHint?: string;
}

// Helper component to render the custom option label
const BankOptionLabel: React.FC<{ bank: Bank }> = ({ bank }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <BankLogo logoUrl={bank.bankLogoUrl} alt={bank.bankName} />
        {bank.bankName} ({bank.bankNameEng} - {bank.bankShortName})
        {bank.country?.countryFlagUrl && bank.country?.countryName && (
            <CountryFlag flagUrl={bank.country.countryFlagUrl} alt={bank.country.countryName} />
        )}
    </div>
);

const BankSelect = forwardRef<any, BankSelectProps>(({
                                                         banks,
                                                         value,
                                                         onChange,
                                                         onBlur,
                                                         name,
                                                         placeholderHint,
                                                         ...props
                                                     }, ref) => {
    const { theme } = useTheme(); // Use useTheme to get the current theme
    const isDarkTheme = theme === 'dark'; // Determine if it's dark theme

    // Prepare options for the Select component from the 'banks' prop
    const options = useMemo(() => {
        const otherBanksOption = banks.find(bank => bank.bankName === "Other banks");
        const filteredBanks = banks.filter(bank => bank.bankName !== "Other banks");

        let data = filteredBanks.map(bank => ({
            value: bank.bankId,
            label: <BankOptionLabel bank={bank} />, // Using the helper component for rich label
            bankDetails: bank // Store full bank object for easy lookup
        }));

        if (otherBanksOption) {
            data.push({
                value: otherBanksOption.bankId,
                label: <BankOptionLabel bank={otherBanksOption} />,
                bankDetails: otherBanksOption
            });
        }
        return data;
    }, [banks]);

    // Find the currently selected option based on the 'value' prop from react-hook-form
    const selectedOption = options.find(option => option.value === value) || null;

    // Determine the current bank to display logo beside label
    const currentBank = selectedOption?.bankDetails || null;

    const handleBankChange = (selected: any) => {
        // Pass the selected value (bankId) back to react-hook-form
        onChange(selected ? selected.value : null);
    };

    const filterOption = (option: { data: { bankDetails: Bank; }; }, searchText: string) => {
        const searchRegex = new RegExp(searchText, 'i');
        const bank = option.data.bankDetails; // Access the stored bankDetails
        return (
            searchRegex.test(bank.bankName) ||
            searchRegex.test(bank.bankNameEng) ||
            searchRegex.test(bank.bankShortName)
        );
    };

    // Define colors using CSS variables for better theme integration
    // These should be defined in your global CSS (e.g., globals.css or base.css)
    const controlBgColor = 'var(--select-control-bg)';
    const controlBorderColor = 'var(--select-control-border)';
    const controlTextColor = 'var(--select-control-text)';
    const optionHoverBg = 'var(--select-option-hover-bg)';
    const optionActiveBg = 'var(--select-option-active-bg)';
    const optionTextColor = 'var(--select-option-text)';
    const singleValueColor = 'var(--select-single-value-text)';


    return (
        <div className="mb-3" style={{ width: '100%' }}>
            <label htmlFor="bankSelector" className="form-label" style={{ color: controlTextColor }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '5px' }}>Bank</span>
                    {currentBank?.bankLogoUrl && (
                        <ImageDisplay
                            imageUrl={currentBank.bankLogoUrl}
                            title={`${currentBank.bankName} logo`}
                            style={{ marginLeft: '8px' }}
                        />
                    )}
                </div>
            </label>
            <Select
                id="bankSelector"
                ref={ref}
                options={options}
                onBlur={onBlur}
                value={selectedOption}
                onChange={handleBankChange}
                isSearchable
                filterOption={filterOption}
                placeholder={placeholderHint || "Search for a bank..."}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        backgroundColor: controlBgColor,
                        color: controlTextColor,
                        border: `1px solid ${controlBorderColor}`,
                        boxShadow: state.isFocused ? `0 0 0 1px ${controlBorderColor}` : 'none', // Add focus styling
                        '&:hover': {
                            borderColor: controlBorderColor, // Maintain border on hover
                        },
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused
                            ? optionHoverBg
                            : state.isSelected
                                ? optionActiveBg // Or a different color for selected
                                : controlBgColor, // Default background
                        color: optionTextColor,
                        cursor: 'pointer',
                    }),
                    singleValue: (provided) => ({
                        ...provided,
                        color: singleValueColor,
                    }),
                    input: (provided) => ({
                        ...provided,
                        color: controlTextColor, // Text color for the input area
                    }),
                    placeholder: (provided) => ({
                        ...provided,
                        color: controlTextColor + '80', // Lighter placeholder text
                    }),
                    menu: (provided) => ({
                        ...provided,
                        backgroundColor: controlBgColor, // Background of the dropdown menu
                        border: `1px solid ${controlBorderColor}`,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }),
                    noOptionsMessage: (provided) => ({
                        ...provided,
                        color: optionTextColor,
                    }),
                }}
                {...props}
            />
        </div>
    );
});

BankSelect.displayName = 'BankSelect';
export default BankSelect;