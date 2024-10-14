import InputField from './InputField'
import {forwardRef} from 'react';

const ReceiverAccountNameInput = forwardRef(({
                                               changeHandler,
                                               validReceiverAccountName,
                                               value,
                                               isFocused,
                                               handleFocus,
                                               handleBlur
                                           }, ref) => {
    return (
        <InputField
            label="Account Name"
            id="receiveraccountname"
            type="text"
            name="receiverAccountName"
            ref={ref}
            required
            validation={{
                isValid: validReceiverAccountName,
                message: <>At least two or more names. <br/>
                    Each starts with a capital letter. <br/>
                    Letters, numbers, underscores, allowed.</>
            }}
            value={value}
            isFocused={isFocused}
            handleChange={changeHandler}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            ariaDescribedBy="receiveraccountnamenote"
            placeholder="Enter your Receiver account name"
        />
    )
});
export default ReceiverAccountNameInput