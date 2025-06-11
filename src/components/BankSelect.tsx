// src/components/BankSelect.tsx
"use client";

import React, { forwardRef, useMemo } from 'react';
import Select from 'react-select';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl'; // Import useTranslations and useLocale

import CountryFlag from '@/components/CountryFlag';
import BankLogo from "@/components/BankLogo";
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
// It now accepts 't' and 'locale' as props

// Helper component to render the custom option label
const BankOptionLabel: React.FC<{ bank: Bank; t: ReturnType<typeof useTranslations>; locale: string }> = ({ bank, t, locale }) => {
    const displayName = useMemo(() => {
        if (locale === 'en' || locale === 'fr') {
            return bank.bankNameEng || bank.bankName;
        } else if (locale === 'zh') {
            return bank.bankName || bank.bankNameEng;
        }
        return bank.bankName;
    }, [bank, locale]);

    return (
        // Outer div: Use flex, align items centrally, but NO flex-wrap here.
        // This ensures Logo, Name Span, and Flag are on the same conceptual line.
        // minHeight ensures consistent vertical spacing even if text wraps.
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', minHeight: '30px' }}>

            {/* BankLogo: flexShrink: 0 ensures it never shrinks or wraps */}
            <BankLogo logoUrl={bank.bankLogoUrl} alt={displayName} style={{ flexShrink: 0 }} />

            {/* Bank Name Span: This is the wrapping element */}
            <span style={{
                marginLeft: '8px',
                flexGrow: 1,       // Allows it to take up available space
                flexShrink: 1,     // Allows it to shrink if needed
                minWidth: 0,       // Crucial for flex items to wrap correctly within their allocated space
                whiteSpace: 'normal',  // Allows text to wrap onto multiple lines
                wordBreak: 'break-word' // Breaks long words if they don't fit
            }}>
                {displayName} {bank.bankShortName && `(${bank.bankShortName})`}
            </span>

            {/* CountryFlag: flexShrink: 0 ensures it never shrinks or wraps */}
            {bank.country?.countryFlagUrl && bank.country?.countryName && (
                <CountryFlag flagUrl={bank.country.countryFlagUrl} alt={bank.country.countryName} style={{ marginLeft: '8px', flexShrink: 0 }} />
            )}
        </div>
    );
};


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
    const t = useTranslations('AddReceiverAccountForm'); // Get translations for the relevant namespace
    const locale = useLocale(); // Get the current locale

    const options = useMemo(() => {
        const otherBanksOption = banks.find(bank => bank.bankName === "Other banks"); // Assuming "Other banks" is consistently named in data
        const filteredBanks = banks.filter(bank => bank.bankName !== "Other banks");

        let data = filteredBanks.map(bank => ({
            value: bank.bankId,
            // Pass 't' and 'locale' to the BankOptionLabel
            label: <BankOptionLabel bank={bank} t={t} locale={locale} />,
            bankDetails: bank
        }));

        if (otherBanksOption) {
            data.push({
                value: otherBanksOption.bankId,
                // Pass 't' and 'locale' to the BankOptionLabel for "Other banks"
                label: <BankOptionLabel bank={otherBanksOption} t={t} locale={locale} />,
                bankDetails: otherBanksOption
            });
        }
        return data;
    }, [banks, t, locale]); // Add 't' and 'locale' to dependencies for re-memoization if locale changes

    const selectedOption = options.find(option => option.value === value) || null;
    const currentBank = selectedOption?.bankDetails || null;

    const handleBankChange = (selected: any) => {
        onChange(selected ? selected.value : null);
    };

    const filterOption = (option: { data: { bankDetails: Bank; }; }, searchText: string) => {
        const searchRegex = new RegExp(searchText, 'i');
        const bank = option.data.bankDetails;
        // Search by all relevant names for better searchability
        return (
            searchRegex.test(bank.bankName) ||
            searchRegex.test(bank.bankNameEng) ||
            searchRegex.test(bank.bankShortName) ||
            // Also allow searching by the currently displayed name if it's different
            (locale === 'zh' && searchRegex.test(bank.bankName)) ||
            ((locale === 'en' || locale === 'fr') && searchRegex.test(bank.bankNameEng || ''))
        );
    };

    // Style variables (remain unchanged)
    const controlBgColor = 'var(--select-control-bg)';
    const controlBorderColor = 'var(--select-control-border)';
    const controlTextColor = 'var(--select-control-text)';
    const optionHoverBg = 'var(--select-option-hover-bg)';
    const optionActiveBg = 'var(--select-option-active-bg)';
    const optionTextColor = 'var(--select-option-text)';
    const singleValueColor = 'var(--select-single-value-text)';


    const bankLogoUrlForDisplay = useMemo(() => {
        if (currentBank?.bankLogoUrl) {
            if (currentBank.bankLogoUrl.startsWith('http://') ||
                currentBank.bankLogoUrl.startsWith('https://') ||
                currentBank.bankLogoUrl.startsWith('/')) {
                return currentBank.bankLogoUrl;
            } else {
                return `/${currentBank.bankLogoUrl}`;
            }
        }
        return null;
    }, [currentBank?.bankLogoUrl]);

    return (
        <div className="mb-3" style={{ width: '100%' }}>
            <label htmlFor="bankSelector" className="form-label" style={{ color: controlTextColor }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '5px' }}>{t('bankLabel')}</span> {/* Translated "Bank" label */}
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
                placeholder={placeholderHint || t('searchBankPlaceholder')}
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