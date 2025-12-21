// src/components/BankLogo.tsx
import Image from "next/image";
import React from "react";
import clsx from "clsx";

interface BankLogoProps {
    logoUrl?: string | null;
    alt: string;
    className?: string;
}

const BankLogo: React.FC<BankLogoProps> = ({
                                               logoUrl,
                                               alt,
                                               className,
                                           }) => {
    // Placeholder when logo is missing
    if (!logoUrl) {
        return (
            <div
                className={clsx(
                    "bg-muted rounded-sm",
                    "h-12 w-12",
                    className
                )}
            />
        );
    }

    // Ensure correct URL resolution
    const processedLogoUrl =
        logoUrl.startsWith("http://") || logoUrl.startsWith("https://")
            ? logoUrl
            : `/${logoUrl}`;

    return (
        <Image
            src={processedLogoUrl}
            alt={alt}
            width={150}          // generous width boundary
            height={48}          // fixed height boundary
            sizes="48px"
            className={clsx(
                "max-h-12 max-w-full object-contain",
                className
            )}
        />
    );
};

export default BankLogo;
