import {useState, useEffect, useRef, forwardRef} from 'react';
import { useSelector } from 'react-redux';
import { selectIsDarkTheme } from '../../features/auth/authSlice';
import isEqual from 'lodash.isequal';
import {Select, MenuItem, FormControl, InputLabel, ThemeProvider, Typography} from '@mui/material';
import {darkColor, lightColor} from '../../util/initials';
import {useTendaTheme} from "../../hooks/useTendaTheme";

const GenderInput = forwardRef(({changeHandler, validGender, value, isFocused, handleFocus, handleBlur}, ref) => {
    const [options, setOptions] = useState([]);
    const [open, setOpen] = useState(false); // State to track whether the dropdown is open
    const valuesRef = useRef([]);
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const theme = useTendaTheme();

    useEffect(() => {
            const values=[
                {
                    value: 'Male',
                    label: 'Male',
                },
                {
                    value: 'Female',
                    label: 'Female',
                },
                {
                    value: 'Other',
                    label: 'Prefer not to say',
                }
            ];
            if (!isEqual(values, valuesRef.current)) {
                valuesRef.current = values;
                const optionsData = values.map((gender) => ({
                    moreData: gender,
                    value: gender.value,
                    label: (<Typography variant="body1" component="span">{gender.label}</Typography>),
                }));
                setOptions(optionsData);
            }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel htmlFor="genderSelector" style={{color: isDarkTheme ? lightColor : darkColor}}>
                    Gender
                </InputLabel>
                <Select
                    id="genderSelector"
                    ref={ref}
                    value={value}
                    onChange={(e) => changeHandler(e)}
                    onOpen={() => setOpen(true)}  // Open the dropdown
                    onClose={() => setOpen(false)} // Close the dropdown
                    open={open}                    // Control the dropdown open state
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                    label="Gender"
                    inputRef={ref}
                    sx={{width: '90%'}}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                backgroundColor: isDarkTheme ? darkColor : lightColor,
                                color: isDarkTheme ? lightColor : darkColor,
                            },
                        },
                    }}
                    variant="outlined"
                >
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </ThemeProvider>
    );
});

export default GenderInput;