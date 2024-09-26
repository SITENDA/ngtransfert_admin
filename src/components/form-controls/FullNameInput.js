import InputField from './InputField'
import {forwardRef} from 'react';

const FullNameInput = forwardRef(({changeHandler, validFullName, value, isFocused, handleFocus, handleBlur}, ref) => {
    return (
        <InputField
            label="Full Name"
            id="fullName"
            type="text"
            name="fullName"
            ref={ref}
            required
            handleChange={changeHandler}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isFocused={isFocused}
            value={value || ""}
            validation={{
                isValid: validFullName,
                message: <>At least two or more names. <br/>
                    Each starts with a capital letter. <br/>
                    Letters, numbers, underscores, allowed.</>
            }}
            ariaDescribedBy="fullnamenote"
            placeholder="Enter your full name"
        />
    )
});
export default FullNameInput
