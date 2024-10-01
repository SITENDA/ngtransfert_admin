import {forwardRef, useState} from 'react';
import {darkColor, lightColor} from "../../util/initials";
import {useSelector} from "react-redux";
import {selectIsDarkTheme} from "../../features/auth/authSlice";
import TopUpMethod from "../../util/TopUpMethod";
import Select from 'react-select';

const TopUpMethodSelector = forwardRef(({
                                     changeHandler,
                                     validTopUpMethod,
                                     value,
                                     isFocused,
                                     handleFocus,
                                     handleBlur
                                 }, ref) => {

    const orderedTopUpMethods = [
        {
            label: "Mobile Money",
            value: TopUpMethod.MOBILE_MONEY,
        },
        {
            label: "Orange Money",
            value: TopUpMethod.ORANGE_MONEY,
        },
        {
            label: "Cash",
            value: TopUpMethod.CASH,
        },
        {
            label: "Bank",
            value: TopUpMethod.BANK
        }

    ]

    const isDarkTheme = useSelector(selectIsDarkTheme);

    const [currentTopUpMethod, setCurrentTopUpMethod] = useState(null);


    const handleTopUpMethodChange = (selectedOption) => {
        const selectedTopUpMethod = orderedTopUpMethods.find(topUpMethod => topUpMethod.value === selectedOption.value);
        setCurrentTopUpMethod(selectedTopUpMethod);
        changeHandler(selectedOption);
    };

    const filterOption = (option, searchText) => {
        const searchRegex = new RegExp(searchText, 'i'); // Case-insensitive search
        const returnedMethod = orderedTopUpMethods.find(method => method.value === option.value);
        return (
            searchRegex.test(returnedMethod.label) || searchRegex.test(returnedMethod.value));
    };

    return (
        <div className="mb-3" style={{width: '90%'}}>
            <label htmlFor="topupSelector" className="form-label" style={{color: isDarkTheme ? lightColor : darkColor}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '5px'}}>Top-Up Method</span>
                </div>
            </label>
            <Select
                id="topupSelector"
                ref={ref}
                options={orderedTopUpMethods}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={currentTopUpMethod ? {
                    value: currentTopUpMethod.value,
                    label: currentTopUpMethod.label
                } : null}
                onChange={handleTopUpMethodChange}
                isSearchable
                filterOption={filterOption}
                placeholder="Search for top up method..."
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

export default TopUpMethodSelector;
