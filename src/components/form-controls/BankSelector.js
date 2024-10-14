import {useState, useEffect, forwardRef} from 'react';
import Select from 'react-select';
import {useSelector} from 'react-redux';
import {selectIsDarkTheme} from '../../features/auth/authSlice';
import { useGetBanksByCountryNameQuery, selectBanksByCountryName } from "../../features/banks/banksSlice";
import BankLogo from './BankLogo';
import CountryFlag from './CountryFlag';
import {darkColor, lightColor} from "../../util/initials";
import ImageDisplay from "./ImageDisplay";

const BankSelector = forwardRef(({
                                     countryName,
                                     changeHandler,
                                     validBank,
                                     value,
                                     isFocused,
                                     handleFocus,
                                     handleBlur
                                 }, ref) => {
    const [options, setOptions] = useState([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {isSuccess} = useGetBanksByCountryNameQuery(countryName);
    // const {isSuccess: successfullyGof } = useGetBanksByCountryNameQuery(countryName);
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const orderedBanks = useSelector(state => selectBanksByCountryName(state, countryName));
    const [currentBank, setCurrentBank] = useState(null);

    useEffect(() => {
        if (isSuccess) {
            // Prepare options for the Select component
            const filteredBanks = orderedBanks.filter(bank => bank.bankName !== "Other banks");
            const otherBanks = orderedBanks.find(bank => bank.bankName === "Other banks");

            const optionsData = filteredBanks.map((bank) => ({
                value: bank.bankId,
                label: (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <BankLogo logoUrl={bank.bankLogoUrl} alt={bank?.bankName}/>
                        {bank.bankName} ({bank?.bankNameEng} - {bank?.bankShortName})
                        <CountryFlag flagUrl={bank?.country.countryFlagUrl} alt={bank?.country.countryName}/>
                    </div>
                ),
            }));

            // If "Other banks" exists, add it at the end
            if (otherBanks) {
                optionsData.push({
                    value: otherBanks.bankId,
                    label: (
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <BankLogo logoUrl={otherBanks.bankLogoUrl} alt={otherBanks?.bankName}/>
                            {otherBanks.bankName} ({otherBanks?.bankNameEng})
                        </div>
                    ),
                });
            }

            setOptions(optionsData);
        }
    }, [isSuccess, orderedBanks]);

    const handleBankChange = (selectedOption) => {
        const selectedBank = orderedBanks.find(bank => bank.bankId === selectedOption.value);
        setCurrentBank(selectedBank);
        changeHandler(selectedOption.value);
    };

    const filterOption = (option, searchText) => {
        const searchRegex = new RegExp(searchText, 'i'); // Case-insensitive search
        const bank = orderedBanks.find(bank => bank.bankId === option.value);
        return (
            searchRegex.test(bank.bankName) ||
            searchRegex.test(bank.bankNameEng) ||
            searchRegex.test(bank.bankShortName)
        );
    };

    return (
        <div className="mb-3" style={{width: '90%'}}>
            <label htmlFor="bankSelector" className="form-label" style={{color: isDarkTheme ? lightColor : darkColor}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '5px'}}>Bank</span>
                    {currentBank?.bankLogoUrl && <ImageDisplay imageUrl={currentBank?.bankLogoUrl}
                                                               title={`${currentBank?.bankName} logo`}
                                                               style={{marginLeft: '8px'}}/>}
                </div>
            </label>
            <Select
                id="bankSelector"
                ref={ref}
                options={options}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={currentBank ? {
                    value: currentBank.bankId,
                    label: `${currentBank.bankShortName} - ${currentBank.bankNameEng} - (${currentBank.bankName})`
                } : null}
                onChange={handleBankChange}
                isSearchable
                filterOption={filterOption}
                placeholder="Search for a bank..."
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

export default BankSelector;