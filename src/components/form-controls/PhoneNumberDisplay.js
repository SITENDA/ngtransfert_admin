import React from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useSelector } from "react-redux";
import { selectIsDarkTheme } from "../../features/auth/authSlice";
import { darkColor, lightColor } from "../../util/initials";
import PhoneIcon from '@mui/icons-material/Phone'; // Add a phone icon for better aesthetics

const PhoneNumberDisplay = ({ phoneNumber }) => {
    // Parse the phone number
    const phoneNumberWithPlusSign = phoneNumber?.trim().startsWith('+') ? phoneNumber.trim() : `+${phoneNumber?.trim()}`;
    const parsedPhoneNumber = phoneNumber?.trim().startsWith('rand_phonenumber') ? false : parsePhoneNumberFromString(phoneNumberWithPlusSign || '');

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
            width: '24px', // Small flag size
            height: '16px', // Aspect ratio for flags
            objectFit: 'cover',
            borderRadius: '2px', // Rounded corners for aesthetics
        },
        fallbackIcon: {
            fontSize: '1.5rem',
            color: 'gray',
        },
        number: {
            letterSpacing: '0.1rem',
            fontSize: '1.0rem',
            color: isDarkTheme ? lightColor : darkColor,
        },
    };

    if (!parsedPhoneNumber) {
        return <span>Invalid phone number</span>;
    }

    const formattedNumber = parsedPhoneNumber.formatInternational();

    return (
        <span style={styles.container}>
            {/* Display flag or fallback icon */}
            <img
                src="https://flagcdn.com/w320/cn.png" // China Flag image
                alt="China Flag"
                style={styles.flag}
            />
            {/* Phone icon */}
            <PhoneIcon style={styles.fallbackIcon} />
            {/* Display the formatted phone number */}
            <span style={styles.number}>{formattedNumber}</span>
        </span>
    );
};

export default PhoneNumberDisplay;