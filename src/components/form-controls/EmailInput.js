import InputField from './InputField'
import { forwardRef } from 'react';

const EmailInput = forwardRef(({changeHandler, validEmail, value, isFocused, handleFocus, handleBlur}, ref) => {
    return (
        <InputField
            label="Email"
            id="email"
            type="email"
            name="email"
            ref={ref}
            required
            handleChange={changeHandler}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isFocused={isFocused}
            value={value || ""}
            validation={{
                isValid: validEmail,
                message: <>Enter a valid email address here.</>
            }}
            ariaDescribedBy="emailnote"
            placeholder="Enter your email"
        />
    )
});

export default EmailInput
