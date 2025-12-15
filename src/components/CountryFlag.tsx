// src/components/banks/CountryFlag.tsx
import Image from 'next/image';
import React from 'react';
import {CountryFlagProps} from "../../types/country";

const CountryFlag: React.FC<CountryFlagProps> = ({ flagUrl, alt, style }) => {
    if (!flagUrl) return null;
    return <Image src={flagUrl} alt={alt} width={20} height={15} style={{ marginLeft: '5px', ...style }} />;
};

export default CountryFlag;