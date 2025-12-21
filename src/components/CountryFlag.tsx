// src/components/banks/CountryFlag.tsx
import Image from "next/image";
import React from "react";
import clsx from "clsx";
import { CountryFlagProps } from "../../types/country";

interface ExtendedCountryFlagProps extends CountryFlagProps {
    className?: string;
}

const CountryFlag: React.FC<ExtendedCountryFlagProps> = ({
                                                             flagUrl,
                                                             alt,
                                                             className,
                                                         }) => {
    if (!flagUrl) return null;

    const processedFlagUrl =
        flagUrl.startsWith("http://") || flagUrl.startsWith("https://")
            ? flagUrl
            : `/${flagUrl}`;

    return (
        <Image
            src={processedFlagUrl}
            alt={alt}
            width={20}
            height={15}
            sizes="20px"
            className={clsx(
                "object-contain",
                className
            )}
        />
    );
};

export default CountryFlag;
