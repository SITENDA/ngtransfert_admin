import React, {forwardRef, useState} from 'react';
import {darkColor, lightColor} from "../../util/initials";
import {useSelector} from "react-redux";
import {selectIsDarkTheme} from "../../features/auth/authSlice";
import {orderedTopUpMethods} from "../../util/TopUpMethod";
import Select from 'react-select';
import SelectedMethodDisplay from "./SelectedMethodDisplay";
import useSelectStyles from "../../hooks/useSelectStyles";

const TopUpMethodSelector = forwardRef(({
                                     changeHandler,
                                     validTopUpMethod,
                                     value,
                                     isFocused,
                                     handleFocus,
                                     handleBlur
                                 }, ref) => {


    const isDarkTheme = useSelector(selectIsDarkTheme);

    const [currentTopUpMethod, setCurrentTopUpMethod] = useState(null);
    const selectStyles = useSelectStyles(isDarkTheme, darkColor, lightColor);


    const handleTopUpMethodChange = (selectedOption) => {
        const selectedTopUpMethod = orderedTopUpMethods.find(topUpMethod => topUpMethod.value === selectedOption.value);
        setCurrentTopUpMethod(selectedTopUpMethod);
        changeHandler(selectedOption);
    };

    const optionsData = orderedTopUpMethods.map((method) => ({
    value: method.value,
    label: ( <SelectedMethodDisplay orderedReceiverAccountType={method}/>),
}));


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
                    <span style={{marginRight: '5px'}}>Please select your top up Method</span>
                </div>
            </label>
            <Select
                id="topupSelector"
                ref={ref}
                options={optionsData}
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
                styles={selectStyles}
            />
        </div>
    );
});

export default TopUpMethodSelector;
