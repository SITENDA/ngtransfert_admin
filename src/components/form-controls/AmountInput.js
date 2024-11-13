import InputField from './InputField';
import { forwardRef } from 'react';

const AmountInput = forwardRef(({
    changeHandler,
    validAmount,
    value,
    isFocused,
    handleFocus,
    handleBlur,
    id,
    label
}, ref) => {
    // Modify changeHandler to include debouncing
    const handleChange = (e) => {
        // Call the provided changeHandler for general state updates and validation
        changeHandler(e);
    };
    return (
        <InputField
            label={label || "Amount"}
            id={id}
            type="number"
            name="amount"
            ref={ref}
            required
            value={value}
            handleChange={handleChange}
            isFocused={isFocused}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            validation={{
                isValid: validAmount,
                message: (
                    <>
                        Enter the amount of money<br />
                        that you'd like to pay. <br />
                        Amount must be greater than 4.
                    </>
                )
            }}
            ariaDescribedBy="amountnote"
            placeholder="Enter amount here"
        />
    );
});

export default AmountInput;
