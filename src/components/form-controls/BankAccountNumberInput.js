import React from 'react'
import InputField from './InputField'
import { forwardRef } from 'react';

const BankAccountNumberInput = forwardRef(({changeHandler, validBankAccountNumber, value, isFocused, handleFocus, handleBlur}, ref) => {

  return (
    <InputField
        label="Bank account number"
        id="bankAccountNumber"
        type="number"
        name="bankAccountNumber"
         ref={ref}
        required
        value={value}
        handleChange={changeHandler}
        isFocused={isFocused}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        validation={{
            isValid: validBankAccountNumber,
            message: <>Enter you bank account number, enter a number of length within 6 to 18 characters. <br /></>
        }}
        ariaDescribedBy="bankAccountNumbernote"
        placeholder="Enter your bank account number here..."
    />
  )
});

export default BankAccountNumberInput