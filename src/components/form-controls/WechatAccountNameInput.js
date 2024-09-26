import InputField from './InputField'
import {forwardRef} from 'react';

const WechatAccountNameInput = forwardRef(({
                                               changeHandler,
                                               validWechatAccountName,
                                               value,
                                               isFocused,
                                               handleFocus,
                                               handleBlur
                                           }, ref) => {

    return (
        <InputField
            label="Wechat Account Name"
            id="wechataccountname"
            type="text"
            name="wechatAccountName"
            ref={ref}
            required
            value={value}
            handleChange={changeHandler}
            isFocused={isFocused}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            validation={{
                isValid: validWechatAccountName,
                message: <>At least two or more names. <br/>
                    Each starts with a capital letter. <br/>
                    Letters, numbers, underscores, allowed.</>
            }}
            ariaDescribedBy="wechataccountnamenote"
            placeholder="Enter your Wechat account name"
        />
    )
});
export default WechatAccountNameInput