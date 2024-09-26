import InputField from './InputField'
import {forwardRef} from 'react';

const PassportNumberInput = forwardRef(({
                                            changeHandler,
                                            validPassportNumber,
                                            value,
                                            isFocused,
                                            handleFocus,
                                            handleBlur
                                        }, ref) => {
    return (
        <InputField
            label="Passport number"
            id="passportNumber"
            type="text"
            name="passportNumber"
            ref={ref}
            required
            handleChange={changeHandler}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isFocused={isFocused}
            value={value || ""}
            validation={{
                isValid: validPassportNumber,
                message: <>Enter you passport number, acceptable length is between 6 to 12 characters. <br/></>
            }}
            ariaDescribedBy="passportNumbernote"
            placeholder="Enter your passport number here..."
        />
    )
});
export default PassportNumberInput
