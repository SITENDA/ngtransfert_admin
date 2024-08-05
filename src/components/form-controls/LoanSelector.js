import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetLoansByClientIdQuery } from '../../features/loans/loanSlice';
import {
    selectCurrentUser,
    selectIsDarkTheme,
    selectMakePaymentsInputs,
    setObjectItem
} from '../../features/auth/authSlice';
import TimeAgo from '../TimeAgo';
import isEqual from 'lodash.isequal';
import { Select, MenuItem, FormControl, InputLabel, createTheme, ThemeProvider, Typography } from '@mui/material';
import { darkColor, lightColor } from '../../util/initials';

const LoanSelector = forwardRef(({ params }, ref) => {
  const { onSelectLoan, setLoan, clientId, nextRef } = params;
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const makePaymentInputs = useSelector(selectMakePaymentsInputs);
  const valuesRef = useRef([]);
  const currentUser = useSelector(selectCurrentUser);
  const isDarkTheme = useSelector(selectIsDarkTheme);

  const handleChange = (event) => {
    const value = event.target.value;
    const selectedLoanDetails = options.find((loan) => loan.value === value);
    dispatch(setObjectItem({ key: 'makePaymentInputs', innerKey: 'loanId', value }));
    setLoan(selectedLoanDetails.moreData);
    nextRef?.current.focus();
  };

  useEffect(() => {
    dispatch(setObjectItem({ key: 'makePaymentInputs', innerKey: 'clientId', value: currentUser?.userId }));
  }, [dispatch, currentUser?.userId]);

  const { data, isSuccess: loansSuccess } = useGetLoansByClientIdQuery(makePaymentInputs?.clientId);

  useEffect(() => {
    if (loansSuccess) {
      const values = Object.values(data?.entities);
      if (values.length > 0 && !isEqual(values, valuesRef.current)) {
        valuesRef.current = values;
        const optionsData = values.map((loan) => ({
          moreData: loan,
          value: loan.loanId,
          label: (
            <Typography variant="body1" component="span">
              {`AED ${loan.principal}`} &nbsp;
              approved <TimeAgo timestamp={loan.approvalDate} /> &nbsp;
              with collateral {` ${loan.collateral}`}
            </Typography>
          ),
        }));
        setOptions(optionsData);
      }
    }
  }, [loansSuccess, data]);

  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? 'dark' : 'light',
      background: {
        default: isDarkTheme ? darkColor : lightColor,
        paper: isDarkTheme ? darkColor : lightColor,
      },
      text: {
        primary: isDarkTheme ? lightColor : darkColor,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel htmlFor="loanSelector" style={{ color: isDarkTheme ? lightColor : darkColor }}>
          Select Loan
        </InputLabel>
        <Select
          id="loanSelector"
          value={makePaymentInputs.loanId || ''}
          onChange={handleChange}
          label="Select Loan"
          inputRef={ref}
          MenuProps={{
            PaperProps: {
              style: {
                backgroundColor: isDarkTheme ? darkColor : lightColor,
                color: isDarkTheme ? lightColor : darkColor,
              },
            },
          }}
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

export default LoanSelector;
