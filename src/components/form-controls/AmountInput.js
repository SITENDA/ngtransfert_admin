import InputField from './InputField';
import { forwardRef, useRef, useEffect } from 'react';

const AmountInput = forwardRef(({
    changeHandler,
    validAmount,
    value,
    isFocused,
    handleFocus,
    handleBlur,
    label,
    handleGetAmountInCNY,
    handleGetAmountInOtherCurrency
}, ref) => {
    // Use a ref to keep track of the debounce timer
    const debounceTimerRef = useRef(null);

    // Modify changeHandler to include debouncing
    const handleChange = (e) => {
        // Call the provided changeHandler for general state updates and validation
        changeHandler(e);

        // Clear the existing timer to restart the countdown
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set a new timer to call the appropriate function after 2 seconds of inactivity
        debounceTimerRef.current = setTimeout(() => {
            if (label === 'Amount in CNY' && handleGetAmountInOtherCurrency) {
                handleGetAmountInOtherCurrency();
            } else if (handleGetAmountInCNY) {
                handleGetAmountInCNY();
            }
            else {
                console.log("Label is : ", label)
            }
        }, 2000);
    };

    // Clean up the timer on component unmount
    useEffect(() => {
        return () => clearTimeout(debounceTimerRef.current);
    }, []);

    return (
        <InputField
            label={label || "Amount"}
            id="amount"
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
