import React, { useState, useEffect, forwardRef } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsDarkTheme, setObjectItem } from '../../features/auth/authSlice';
import CountryFlag from './CountryFlag';
import { darkColor, lightColor } from "../../util/initials";
import { selectAllCountries, useGetAllCountriesQuery } from "../../features/countries/countriesSlice";
import { useTendaTheme } from "../useTendaTheme";
import { Box } from '@mui/material';

const CountrySelector = forwardRef(({ changeHandler, validCountry, label, value, isFocused, handleFocus, handleBlur }, ref) => {
  const [options, setOptions] = useState([]);
  const { data, isSuccess } = useGetAllCountriesQuery();
  const isDarkTheme = useSelector(selectIsDarkTheme);
  const allCountries = useSelector(selectAllCountries);
  const [currentCountry, setCurrentCountry] = useState(null);
  const dispatch = useDispatch();
  const theme = useTendaTheme();

  useEffect(() => {
    if (isSuccess) {
      const countries = Object.values(data?.entities);
      const currentlyActiveCountries = ["Mali", "DR Congo", "Republic of the Congo", "Ivory Coast", "Gabon", "Senegal", "Togo", "China"];
      const filteredCountries = countries.filter(country => currentlyActiveCountries.includes(country.countryName));

      // Prepare options for the Select component
      const optionsData = filteredCountries.map((country) => ({
        value: country.countryId,
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {country.countryName !== "Other countries" && (
              <>
                {country.countryName}
                <CountryFlag flagUrl={country.countryFlagUrl} alt={country.countryName} />
              </>
            )}
          </div>
        ),
      }));
      setOptions(optionsData);
    }
  }, [data, isSuccess]);

  const handleCountryChange = (selectedOption) => {
    const selectedCountry = allCountries.find(country => country.countryId === selectedOption.value);
    setCurrentCountry(selectedCountry);
    changeHandler(selectedOption.value);
    setTimeout(() => {
      dispatch(setObjectItem({ key: 'validTransferRequest', innerKey: "validCountryOfDepositId", value: true }));
    }, 2000);
  };

  const filterOption = (option, searchText) => {
    const searchRegex = new RegExp(searchText, 'i'); // Case-insensitive search
    const country = allCountries.find(country => country.countryId === option.value);
    return searchRegex.test(country.countryName);
  };

  return (
    <Box sx={{ mb: 3, width: '90%' }}>
      <label htmlFor="countrySelector" className="form-label" style={{ color: isDarkTheme ? lightColor : darkColor }}>
        {label}
      </label>
      <Select
        id="countrySelector"
        ref={ref}
        options={options}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={currentCountry ? { value: currentCountry.countryId, label: `${currentCountry.countryName}` } : null}
        onChange={handleCountryChange}
        isSearchable
        filterOption={filterOption}
        placeholder="Search for a country..."
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
    </Box>
  );
});

export default CountrySelector;