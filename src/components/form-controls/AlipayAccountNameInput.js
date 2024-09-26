import InputField from './InputField'
import {forwardRef} from 'react';

const AlipayAccountNameInput = forwardRef(({
                                               changeHandler,
                                               validAlipayAccountName,
                                               value,
                                               isFocused,
                                               handleFocus,
                                               handleBlur
                                           }, ref) => {
    return (
        <InputField
            label="Alipay Account Name"
            id="alipayaccountname"
            type="text"
            name="alipayAccountName"
            ref={ref}
            required
            validation={{
                isValid: validAlipayAccountName,
                message: <>At least two or more names. <br/>
                    Each starts with a capital letter. <br/>
                    Letters, numbers, underscores, allowed.</>
            }}
            value={value}
            isFocused={isFocused}
            handleChange={changeHandler}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            ariaDescribedBy="alipayaccountnamenote"
            placeholder="Enter your Alipay account name"
        />
    )
});
export default AlipayAccountNameInput