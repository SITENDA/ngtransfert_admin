import React, {useState, useEffect, forwardRef} from 'react';
import Select from 'react-select';
import {useSelector} from 'react-redux';
import {selectIsDarkTheme} from '../../features/auth/authSlice';
import {useGetAllCurrenciesQuery, selectAllCurrencies} from "../../features/currencies/currenciesSlice";
import {darkColor, lightColor} from "../../util/initials";

const CurrencySelector = forwardRef(({
                                         changeHandler,
                                         validCurrency,
                                         value,
                                         isFocused,
                                         handleFocus,
                                         handleBlur
                                     }, ref) => {
    const [options, setOptions] = useState([]);
    const {isSuccess} = useGetAllCurrenciesQuery();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const orderedCurrencies = useSelector(selectAllCurrencies);
    const [currentCurrency, setCurrentCurrency] = useState(null);

    useEffect(() => {
        if (isSuccess) {
            // Prepare options based on the current object fields
            // TODO -- Re-order the currencies such that these are on top:
            // Chinese yuan (CNY) or renminbi (RMB)
            // United States Dollar
            // West African CFA franc
            // Congolese Franc
            // Central African CFA franc
            const optionsData = orderedCurrencies.map((currency) => ({
                value: currency.currencyId,
                label: (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span>{currency.currencyCode} - {currency.currencyName}</span>
                    </div>
                ),
            }));
            setOptions(optionsData);
        }
    }, [isSuccess, orderedCurrencies]);

    const handleCurrencyChange = (selectedOption) => {
        const selectedCurrency = orderedCurrencies.find(currency => currency.currencyId === selectedOption.value);
        setCurrentCurrency(selectedCurrency);
        changeHandler(selectedOption.value);
    };

    const filterOption = (option, searchText) => {
        const searchRegex = new RegExp(searchText, 'i'); // Case-insensitive search
        const currency = orderedCurrencies.find(currency => currency.currencyId === option.value);
        return (
            searchRegex.test(currency.currencyName) ||
            searchRegex.test(currency.currencyCode)
        );
    };

    return (
        <div className="mb-3" style={{width: '90%'}}>
            <label htmlFor="currencySelector" className="form-label"
                   style={{color: isDarkTheme ? lightColor : darkColor}}>
                Select Currency
            </label>
            <Select
                id="currencySelector"
                ref={ref}
                options={options}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={currentCurrency ? {
                    value: currentCurrency.currencyId,
                    label: `${currentCurrency.currencyCode} - ${currentCurrency.currencyName}`
                } : null}
                onChange={handleCurrencyChange}
                isSearchable
                filterOption={filterOption}
                placeholder="Search for a currency..."
                styles={{
                    control: (base) => ({
                        ...base,
                        backgroundColor: isDarkTheme ? darkColor : lightColor,
                        color: isDarkTheme ? lightColor : darkColor,
                        border: `1px solid ${isDarkTheme ? lightColor : darkColor}`,
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? (isDarkTheme ? '#555' : '#eee') : (isDarkTheme ? darkColor : lightColor),
                        color: isDarkTheme ? lightColor : darkColor,
                    }),
                    singleValue: (provided) => ({
                        ...provided,
                        color: isDarkTheme ? 'white' : darkColor, // Set text color for selected item
                    }),
                }}
            />
        </div>
    );
});

export default CurrencySelector;