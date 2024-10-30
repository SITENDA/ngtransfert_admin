import React, {useState} from 'react'
import InputField from './InputField'
import {forwardRef} from 'react';
import {useSelector} from "react-redux";
import {selectIsDarkTheme} from "../../features/auth/authSlice";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {darkColor, lightColor} from "../../util/initials";

const ConfirmPasswordInput = forwardRef(({
                                             changeHandler,
                                             validConfirmPassword,
                                             value,
                                             isFocused,
                                             handleFocus,
                                             handleBlur
                                         }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const iconColor = isDarkTheme ? lightColor : darkColor;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', width: '100%'}}>
            <InputField
                label="Confirm Password"
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                ref={ref}
                required
                handleChange={changeHandler}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                isFocused={isFocused}
                value={value || ""}
                validation={{
                    isValid: validConfirmPassword,
                    message: <>Must match the first password input field</>
                }}
                ariaDescribedBy="confirmpasswordnote"
                placeholder="Type your password again"
                style={{flex: 1}}
            />

            {/* Toggle Button for showing/hiding password */}
            <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginLeft: '8px'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <AiFillEyeInvisible size={20} color={iconColor}/> :
                    <AiFillEye size={20} color={iconColor}/>}
            </button>
        </div>
    )
});

export default ConfirmPasswordInput

