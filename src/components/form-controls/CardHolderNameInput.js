import InputField from './InputField'
import {forwardRef} from 'react';

const CardHolderNameInput = forwardRef(({
                                            changeHandler,
                                            validCardHolderName,
                                            value,
                                            isFocused,
                                            handleFocus,
                                            handleBlur
                                        }, ref) => {
    return (
        <InputField
            label="Card Holder Name"
            id="cardHolderName"
            type="text"
            name="cardHolderName"
            ref={ref}
            required
            value={value}
            handleChange={changeHandler}
            isFocused={isFocused}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            validation={{
                isValid: validCardHolderName,
                message: <>Atleast two or more names. <br/>
                    Each starts with a capital letter. <br/>
                    Letters, numbers, underscores, allowed.</>
            }}
            ariaDescribedBy="cardholdernamenote"
            placeholder="Enter your registered name at the bank."
        />
    )
});
export default CardHolderNameInput