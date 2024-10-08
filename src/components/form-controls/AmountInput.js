import InputField from './InputField'
import {forwardRef} from 'react';

const AmountInput = forwardRef(({changeHandler, validAmount, value, isFocused, handleFocus, handleBlur, label}, ref) => {
    return (
        <InputField
            label={label ? label : "Amount"}
            id="amount"
            type="number"
            name="amount"
            ref={ref}
            required
            value={value}
            handleChange={changeHandler}
            isFocused={isFocused}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            validation={{
                isValid: validAmount,
                message: <>Enter the amount of money<br/>that you'd like to pay. <br/>
                    Amount must be greater than 4.</>
            }}
            ariaDescribedBy="amountnote"
            placeholder="Enter amount here"
        />
    )
});
export default AmountInput
