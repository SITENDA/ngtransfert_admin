import React, {forwardRef, useState} from 'react';
import {darkColor, lightColor} from "../../util/initials";
import {useSelector} from "react-redux";
import {selectIsDarkTheme} from "../../features/auth/authSlice";
import {orderedReceiverAccountTypes} from "../../util/ReceiverAccountType";
import Select from 'react-select';
import SelectedMethodDisplay from "./SelectedMethodDisplay";

const ReceiverAccountTypeSelector = forwardRef(({
                                     changeHandler,
                                     validReceiverAccountType,
                                     value,
                                     isFocused,
                                     handleFocus,
                                     handleBlur
                                 }, ref) => {


    const isDarkTheme = useSelector(selectIsDarkTheme);
    const [currentReceiverAccountType, setCurrentReceiverAccountType] = useState(null);


    const handleReceiverAccountTypeChange = (selectedOption) => {
        const selectedReceiverAccountType = orderedReceiverAccountTypes.find(receiverAccountType => receiverAccountType.value === selectedOption.value);
        setCurrentReceiverAccountType(selectedReceiverAccountType);
        changeHandler(selectedOption);
    };

    const optionsData = orderedReceiverAccountTypes.map((method) => ({
    value: method.value,
    label: ( <SelectedMethodDisplay method={method}/>),
}));


    const filterOption = (option, searchText) => {
        const searchRegex = new RegExp(searchText, 'i'); // Case-insensitive search
        const returnedMethod = orderedReceiverAccountTypes.find(method => method.value === option.value);
        return (
            searchRegex.test(returnedMethod.label) || searchRegex.test(returnedMethod.value));
    };

    return (
        <div className="mb-3" style={{width: '90%'}}>
            <label htmlFor="receiverAccountTypeSelector" className="form-label" style={{color: isDarkTheme ? lightColor : darkColor}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {!value && <span style={{marginRight: '5px'}}>Select Receiver Account Type</span>}
                    {value && <><span style={{marginRight: '5px'}}>Account Type : {currentReceiverAccountType?.icon}</span> </>}
                </div>
            </label>
            <Select
                id="receiverAccountTypeSelector"
                ref={ref}
                options={optionsData}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={currentReceiverAccountType ? {
                    value: currentReceiverAccountType.value,
                    label: currentReceiverAccountType.label
                } : null}
                onChange={handleReceiverAccountTypeChange}
                isSearchable
                filterOption={filterOption}
                placeholder="Search receiver account type..."
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

export default ReceiverAccountTypeSelector;