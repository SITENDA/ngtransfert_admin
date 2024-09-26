import React from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useSelector } from "react-redux";
import { selectIsDarkTheme } from "../../features/auth/authSlice";
import { darkColor, lightColor } from "../../util/initials";

const PhoneNumberDisplay = ({ phoneNumber }) => {
    // Parse the phone number to get country code and formatted number
    const phoneNumberWithPlusSign = phoneNumber?.trim().startsWith('+') ? phoneNumber.trim() : `+${phoneNumber?.trim()}`;
    const parsedPhoneNumber = phoneNumber?.trim().startsWith('rand_phonenumber') ? false: parsePhoneNumberFromString(phoneNumberWithPlusSign || '');
    const isDarkTheme = useSelector(selectIsDarkTheme);

    // Styling
    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.2rem',
            fontFamily: 'Arial, sans-serif',
        },
        flag: {
            width: '24px', // Adjusted width for a small flag
            height: '16px', // Maintain aspect ratio for the flag
            objectFit: 'cover',
            borderRadius: '2px', // Slightly rounded corners for better aesthetics
        },
        fallbackIcon: {
            fontSize: '1.5rem',
            color: 'gray',
        },
        number: {
            letterSpacing: '0.1rem',
            fontSize: '1.0rem',
            color: isDarkTheme ? lightColor : darkColor,
            backgroundColor: 'transparent',
        },
    };

    if (!parsedPhoneNumber) {
        return <span>Invalid phone number</span>;
    }

    const formattedNumber = parsedPhoneNumber.formatInternational();

    // Render the phone number with China flag and better formatting
    return (
        <div style={styles.container}>
            <img
                src="https://flagcdn.com/w320/cn.png" // China Flag image
                alt="China Flag"
                style={styles.flag}
            />
            <span style={styles.number}>{formattedNumber}</span>
        </div>
    );
};

export default PhoneNumberDisplay;