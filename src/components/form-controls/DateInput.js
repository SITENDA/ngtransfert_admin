import React, { useState, forwardRef, useEffect } from 'react';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const DateInput = forwardRef(({ changeHandler, validDate, value, isFocused, handleFocus, handleBlur, label }, ref) => {
    // Set current date as default if no value is provided
    const [selectedDate, setSelectedDate] = useState(value || new Date());

    useEffect(() => {
        if (!value) {
            changeHandler(selectedDate);  // Trigger changeHandler with the default value
        }
    }, [selectedDate, changeHandler, value]);

    const handleDateChange = (newValue) => {
        setSelectedDate(newValue);
        changeHandler(newValue);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                ref={ref}
                label={label}
                value={value}
                onChange={handleDateChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                )}
            />
        </LocalizationProvider>
    );
});

export default DateInput;
