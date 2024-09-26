import React from 'react'
import InputField from './InputField'
import { forwardRef } from 'react';

const ConfirmPasswordInput = forwardRef(({changeHandler, validConfirmPassword, value, isFocused, handleFocus, handleBlur}, ref) => {
  return (
    <InputField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            ref={ref}
            required
            handleChange={changeHandler}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isFocused={isFocused}
            value={value || ""}
            validation={{
                isValid: validConfirmPassword,
                message: <>Must match the first password input field</>
            }}
            ariaDescribedBy="confirmpasswordnote"
            placeholder="Type your password again"
        />
  )
});

export default ConfirmPasswordInput

