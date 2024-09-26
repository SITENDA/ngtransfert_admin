import InputField from './InputField'
import {forwardRef} from 'react';

const RateInput = forwardRef(({changeHandler, validRate, value, isFocused, handleFocus, handleBlur}, ref) => {
    return (
        <InputField
            label="Rate"
            id="rate"
            type="text"
            name="rate"
            ref={ref}
            required
            value={value}
            handleChange={changeHandler}
            isFocused={isFocused}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            validation={{
                isValid: validRate,
                message: <>Enter the exchange rate<br/>to be used in the transfer. <br/> Number greater than
                    zero <br/> Decimals allowed too</>
            }}
            ariaDescribedBy="ratenote"
            placeholder="Enter rate here"
        />
    )
});
export default RateInput
