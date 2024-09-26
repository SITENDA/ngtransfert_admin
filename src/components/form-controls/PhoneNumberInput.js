import { forwardRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectIsDarkTheme, setObjectItem } from "../../features/auth/authSlice";
import { darkColor, lightColor } from "../../util/initials";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-input-2";
// import 'react-phone-input-2/lib/style.css'; // Ensure you have the necessary CSS for the phone input
import '../../assets/css/new-phone-input.css'
import '../../assets/css/PhoneNumberInput.css'

const PhoneNumberInput = forwardRef(({ changeHandler, validPhoneNumber, value, focus }, ref) => {
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);

    // Styles object
    const styles = {
        label: {
            color: isDarkTheme ? lightColor : darkColor
        },
        input: {
            maxWidth: '90%',
            color: isDarkTheme ? lightColor : darkColor,
            backgroundColor: isDarkTheme ? darkColor : lightColor // Adjusts background color based on theme
        },
        dropdown: {
            backgroundColor: isDarkTheme ? darkColor : lightColor,
            color: isDarkTheme ? lightColor : darkColor,
            ':hover': {
                backgroundColor: isDarkTheme ? lightColor : darkColor, // Adjusts hover background color based on theme
                color: isDarkTheme ? darkColor : lightColor // Adjusts hover text color based on theme
            }
        }
    };

    return (
        <div className={`mb-3 ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
            <label htmlFor="phoneNumber" className="form-label" style={styles.label}>
                Phone Number
                <span className={validPhoneNumber ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck}/>
                </span>
                <span className={validPhoneNumber || !value ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
            </label>
            <PhoneInput
                id="phoneNumber"
                name="phoneNumber"
                country={'cn'}
                value={value}
                onChange={changeHandler}
                ref={ref}
                inputProps={{
                    required: true,
                    'aria-invalid': validPhoneNumber ? "false" : "true",
                    'aria-describedby': 'phonenote',
                    style: styles.input // Apply input styles
                }}
                dropdownStyle={styles.dropdown} // Apply dropdown styles
                buttonStyle={styles.dropdown} // Apply button styles for consistency
                onFocus={() =>
                    dispatch(setObjectItem({key: 'registrationFocus', innerKey: "phoneNumberFocus", value: true}))
                }
                onBlur={() =>
                    dispatch(setObjectItem({key: 'registrationFocus', innerKey: "phoneNumberFocus", value: false}))
                }
            />
            <p id='phonenote' className={focus && !validPhoneNumber ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faCircle}/>
                Valid phone numbers are between 10 to 13 digits.<br/>
            </p>
        </div>
    );
});

export default PhoneNumberInput;
