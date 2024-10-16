import {useMemo} from 'react';

const useSelectStyles = (isDarkTheme, darkColor, lightColor) => {
    return useMemo(() => ({
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
            color: isDarkTheme ? 'white' : darkColor,
        }),
    }), [isDarkTheme, darkColor, lightColor]);
};

export default useSelectStyles;