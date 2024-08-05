import React from 'react'

import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectMoreInputsValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';

const BankAccountNumberInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectMoreInputsValids)
    const dispatch = useDispatch();
    const handleChange = (event) => {
        dispatch(setObjectItem({ key: 'moreInputs', innerKey: 'bankAccountNumber', value: event.target.value }));
    };

  return (
    <InputField
        label="Bank account number"
        id="bankAccountNumber"
        type="number"
        name="bankAccountNumber"
         ref={ref}
        required
        onChange={handleChange}
        validation={{
            isValid: valids.validBankAccountNumber,
            message: <>Enter you bank account number, enter a number of length within 6 to 18 characters. <br /></>
        }}
        ariaDescribedBy="bankAccountNumbernote"
        placeholder="Enter your bank account number here..."
    />
  )
});

export default BankAccountNumberInput