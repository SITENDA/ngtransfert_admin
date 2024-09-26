import InputField from './InputField'
import {forwardRef} from 'react';

const BankNameInput = forwardRef(({changeHandler, validBankName, value, isFocused, handleFocus, handleBlur}, ref) => {
    return (
        <InputField
            label="Bank Name"
            id="bankName"
            type="text"
            name="bankName"
            ref={ref}
            required
            value={value}
            handleChange={changeHandler}
            isFocused={isFocused}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            validation={{
                isValid: validBankName,
                message: <>
                    Bank name usually contains the word "Bank" if in English. <br/>
                    Bank name usually contains the word "银行" if in Chinese. <br/>
                    You may add the bank name's short form. <br/>
                    e.g Bank of China (BOC) <br/>
                </>
            }}
            ariaDescribedBy="banknamenote"
            placeholder="Enter the name of the bank here."
        />
    )
});
export default BankNameInput