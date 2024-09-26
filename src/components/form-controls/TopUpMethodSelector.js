import React from 'react';
import {FormControl, InputLabel, Select, MenuItem, ThemeProvider} from '@mui/material';
import {useTendaTheme} from "../useTendaTheme";

const TopUpMethodSelector = ({selectedMethod, onMethodChange}) => {

    const theme = useTendaTheme();

    return (
        <ThemeProvider theme={theme}>
            <FormControl fullWidth>
            <InputLabel id="topup-method-label">Select Top-Up Method</InputLabel>
            <Select
                labelId="topup-method-label"
                value={selectedMethod}
                onChange={onMethodChange}
                label="Select Top-Up Method"
                variant='outlined'>
                <MenuItem value="Mobile Money">Mobile Money</MenuItem>
                <MenuItem value="Bank">Bank</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
            </Select>
        </FormControl>
        </ThemeProvider>
    );
};

export default TopUpMethodSelector;
