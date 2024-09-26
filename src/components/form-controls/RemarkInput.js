import React from 'react'
import InputField from './InputField'
import {forwardRef} from 'react';

const RemarkInput = forwardRef(({changeHandler, validRemark, value, isFocused, handleFocus, handleBlur}, ref) => {

    return (
        <InputField
            label="Remark"
            id="remark"
            type="remark"
            name="remark"
            ref={ref}
            required
            value={value}
            handleChange={changeHandler}
            validation={{
                isValid: validRemark,
                message: <>A remark may be a word or a sentence. <br/></>
            }}
            isFocused={isFocused}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            ariaDescribedBy="remarknote"
            placeholder="Enter your remark here..."
        />
    )
});

export default RemarkInput
