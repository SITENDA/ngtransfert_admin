// src/components/BankSelect.tsx
"use client";

import React, { forwardRef, useMemo } from 'react';
import Select from 'react-select';
import { useTheme } from 'next-themes';

import CountryFlag from '@/components/CountryFlag';
import ImageDisplay from '@/components/ImageDisplay'; // Assuming this is correct

import BankLogo from "@/components/BankLogo"; // Assuming this is correct
import {Bank} from "../../types/bank";

interface BankSelectProps {
    banks: Bank[];
    value?: number | null;
    onChange: (bankId: number | null) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
    placeholderHint?: string;
    onMenuStateChange?: (isOpen: boolean) => void;
}

// Helper component to render the custom option label
const BankOptionLabel: React.FC<{ bank: Bank }> = ({ bank }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* BankLogo likely already handles path correction if it works in dropdown */}
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
                                                         onMenuStateChange,
                                                         ...props
                                                     }, ref) => {
    const { theme } = useTheme();

    const options = useMemo(() => {
        const otherBanksOption = banks.find(bank => bank.bankName === "Other banks");
        const filteredBanks = banks.filter(bank => bank.bankName !== "Other banks");

        let data = filteredBanks.map(bank => ({
            value: bank.bankId,
            label: <BankOptionLabel bank={bank} />,
            bankDetails: bank
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

    const selectedOption = options.find(option => option.value === value) || null;
    const currentBank = selectedOption?.bankDetails || null;

    const handleBankChange = (selected: any) => {
        onChange(selected ? selected.value : null);
    };

    const filterOption = (option: { data: { bankDetails: Bank; }; }, searchText: string) => {
        const searchRegex = new RegExp(searchText, 'i');
        const bank = option.data.bankDetails;
        return (
            searchRegex.test(bank.bankName) ||
            searchRegex.test(bank.bankNameEng) ||
            searchRegex.test(bank.bankShortName)
        );
    };

    const controlBgColor = 'var(--select-control-bg)';
    const controlBorderColor = 'var(--select-control-border)';
    const controlTextColor = 'var(--select-control-text)';
    const optionHoverBg = 'var(--select-option-hover-bg)';
    const optionActiveBg = 'var(--select-option-active-bg)';
    const optionTextColor = 'var(--select-option-text)';
    const singleValueColor = 'var(--select-single-value-text)';


    // --- NEW LOGIC HERE ---
    const bankLogoUrlForDisplay = useMemo(() => {
        if (currentBank?.bankLogoUrl) {
            // Check if it's already an absolute URL (e.g., starts with http:// or https://)
            // or if it already starts with a /
            if (currentBank.bankLogoUrl.startsWith('http://') ||
                currentBank.bankLogoUrl.startsWith('https://') ||
                currentBank.bankLogoUrl.startsWith('/')) {
                return currentBank.bankLogoUrl;
            } else {
                // Prepend a slash if it's a relative path assumed to be in /public
                return `/${currentBank.bankLogoUrl}`;
            }
        }
        return null;
    }, [currentBank?.bankLogoUrl]);
    // --- END NEW LOGIC ---

    return (
        <div className="mb-3" style={{ width: '100%' }}>
            <label htmlFor="bankSelector" className="form-label" style={{ color: controlTextColor }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '5px' }}>Bank</span>
                    {bankLogoUrlForDisplay && ( // Use the new formatted URL
                        <ImageDisplay
                            imageUrl={bankLogoUrlForDisplay}
                            title={`${currentBank?.bankName || 'Selected bank'} logo`}
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
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                onMenuOpen={() => onMenuStateChange?.(true)}
                onMenuClose={() => onMenuStateChange?.(false)}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        backgroundColor: controlBgColor,
                        color: controlTextColor,
                        border: `1px solid ${controlBorderColor}`,
                        boxShadow: state.isFocused ? `0 0 0 1px ${controlBorderColor}` : 'none',
                        '&:hover': {
                            borderColor: controlBorderColor,
                        },
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused
                            ? optionHoverBg
                            : state.isSelected
                                ? optionActiveBg
                                : controlBgColor,
                        color: optionTextColor,
                        cursor: 'pointer',
                    }),
                    singleValue: (provided) => ({
                        ...provided,
                        color: singleValueColor,
                    }),
                    input: (provided) => ({
                        ...provided,
                        color: controlTextColor,
                    }),
                    placeholder: (provided) => ({
                        ...provided,
                        color: controlTextColor + '80',
                    }),
                    menu: (provided) => ({
                        ...provided,
                        backgroundColor: controlBgColor,
                        border: `1px solid ${controlBorderColor}`,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        zIndex: 9999,
                    }),
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999
                    })
                }}
                {...props}
            />
        </div>
    );
});

BankSelect.displayName = 'BankSelect';
export default BankSelect;