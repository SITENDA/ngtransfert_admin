'use client';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

interface PhoneNumberDisplayProps {
    phoneNumber: string;
}

const PhoneNumberDisplay: React.FC<PhoneNumberDisplayProps> = ({ phoneNumber }) => {
    if (!phoneNumber) {
        return <span className="text-muted-foreground">Invalid phone number</span>;
    }

    const phoneNumberWithPlus = phoneNumber.trim().startsWith('+')
        ? phoneNumber.trim()
        : `+${phoneNumber.trim()}`;

    // Exclude random placeholders like 'rand_phonenumberXYZ'
    const isFakePhone = phoneNumber.trim().startsWith('rand_phonenumber');
    const parsed = isFakePhone ? undefined : parsePhoneNumberFromString(phoneNumberWithPlus);

    if (!parsed) {
        return <span className="text-muted-foreground">Invalid phone number</span>;
    }

    const formattedNumber = parsed.formatInternational();

    return (
        <div className="flex items-center gap-2 text-sm text-foreground font-medium">
            <img
                src="https://flagcdn.com/w40/cn.png"
                alt="China Flag"
                className="w-6 h-4 object-cover rounded-sm"
            />
            <span className="tracking-wide">{formattedNumber}</span>
        </div>
    );
};

export default PhoneNumberDisplay;
