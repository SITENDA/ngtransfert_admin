import React from 'react'
import InputField from './InputField'
import {forwardRef} from 'react';

const CollateralInput = forwardRef(({
                                        changeHandler,
                                        validCollateral,
                                        value,
                                        isFocused,
                                        handleFocus,
                                        handleBlur
                                    }, ref) => {

    return (
        <InputField
            label="Collateral"
            id="collateral"
            type="text"
            name="collateral"
            ref={ref}
            required
            handleChange={changeHandler}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isFocused={isFocused}
            value={value || ""}
            validation={{
                isValid: validCollateral,
                message: <>Enter your collateral here It is the item you pledge for the repayment of this loan.<br/>
                </>
            }}
            ariaDescribedBy="collateralnote"
            placeholder="Enter collateral here"
        />
    )
});

export default CollateralInput
