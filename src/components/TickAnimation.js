import React from 'react';
import '../assets/css/TickAnimation.css';
import { useSelector } from "react-redux";
import { selectIsDarkTheme } from "../features/auth/authSlice";
import {darkColor, lightColor} from "../util/initials";

const TickAnimation = ({ successMessage }) => {
    const isDarkTheme = useSelector(selectIsDarkTheme);

    // Styles based on theme
    const wrapperStyle = {
        backgroundColor: isDarkTheme ? darkColor : lightColor,
        color: isDarkTheme ? lightColor : darkColor,
    };

    return (
        <div className="wrapper" style={wrapperStyle}>
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
            <div className="success-message">{successMessage}</div>
        </div>
    );
};

export default TickAnimation;
