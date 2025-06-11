// src/components/banks/BankLogo.tsx
import Image from 'next/image';
import React from 'react';
import {BankLogoProps} from "../../types/bank";

const BankLogo: React.FC<BankLogoProps> = ({ logoUrl, alt, style }) => {
    if (!logoUrl) return null;
    return <Image src={logoUrl} alt={alt} width={24} height={24} style={{ marginRight: '5px', ...style }} />;
};

export default BankLogo;