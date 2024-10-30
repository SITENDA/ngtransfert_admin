import React, { useState, forwardRef } from 'react';
import InputField from './InputField';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { selectIsDarkTheme } from "../../features/auth/authSlice";
import {darkColor, lightColor} from "../../util/initials";

const PasswordInput = forwardRef(({ changeHandler, validPassword, value, isFocused, handleFocus, handleBlur }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isDarkTheme = useSelector(selectIsDarkTheme);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Conditional color based on theme
    const iconColor = isDarkTheme ? lightColor : darkColor;

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <InputField
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                ref={ref}
                required
                handleChange={changeHandler}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                isFocused={isFocused}
                value={value || ""}
                validation={{
                    isValid: validPassword,
                    message: (
                        <>Password Requirements: <br />
                            - 4 to 24 characters long <br />
                            - Contains at least one uppercase letter <br />
                            - Contains at least one lowercase letter <br />
                            - Contains at least one digit <br />
                            - Contains at least one special character <br />
                            (Allowed special characters: !, @, #, $, %, etc.)
                        </>
                    )
                }}
                ariaDescribedBy="passwordnote"
                placeholder="Enter your password"
                style={{ flex: 1 }}
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
                {showPassword ? <AiFillEyeInvisible size={20} color={iconColor} /> : <AiFillEye size={20} color={iconColor} />}
            </button>
        </div>
    );
});

export default PasswordInput;