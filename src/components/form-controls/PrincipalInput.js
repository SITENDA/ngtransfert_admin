import InputField from './InputField'
import {forwardRef} from 'react';

const PrincipalInput = forwardRef(({changeHandler, validPrincipal, value, isFocused, handleFocus, handleBlur}, ref) => {
    return (
        <InputField
            label="Amount"
            id="principal"
            type="number"
            name="principal"
            ref={ref}
            required
            handleChange={changeHandler}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isFocused={isFocused}
            value={value || ""}
            validation={{
                isValid: validPrincipal,
                message: <>Enter the amount of money<br/>
                    that you'd like to be lent here. <br/></>
            }}
            ariaDescribedBy="principalnote"
            placeholder="Enter amount here"
        />
    )
});
export default PrincipalInput