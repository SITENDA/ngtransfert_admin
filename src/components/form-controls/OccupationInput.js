import InputField from './InputField'
import {forwardRef} from 'react';

const OccupationInput = forwardRef(({
                                        changeHandler,
                                        validOccupation,
                                        value,
                                        isFocused,
                                        handleFocus,
                                        handleBlur
                                    }, ref) => {
    return (
        <InputField
            label="Occupation"
            id="occupation"
            type="text"
            name="occupation"
            ref={ref}
            required
            handleChange={changeHandler}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isFocused={isFocused}
            value={value || ""}
            validation={{
                isValid: validOccupation,
                message: <>Enter your occupation, e.g. teacher, driver, doctor, engineer, etc.
                    Input a word or phrase, without special characters. <br/></>
            }}
            ariaDescribedBy="occupationnote"
            placeholder="Enter occupation here..."
        />
    )
});
export default OccupationInput
