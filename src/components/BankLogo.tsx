// src/components/BankLogo.tsx
import Image from 'next/image';
import React from 'react';

interface BankLogoProps {
    logoUrl?: string | null;
    alt: string;
    style?: React.CSSProperties;
}

const BankLogo: React.FC<BankLogoProps> = ({ logoUrl, alt, style }) => {
    if (!logoUrl) {
        // Return a placeholder div with the desired fixed height and a default width
        // so layout doesn't shift if the logo is missing.
        return <div style={{ width: 50, maxHeight: '50px', height: 50, marginRight: '5px', display: 'inline-block', backgroundColor: '#ccc', ...style }}></div>;
    }

    // Ensure the logoUrl starts with a '/' for public folder access,
    // or keep it as is if it's already a full external URL.
    const processedLogoUrl = logoUrl.startsWith('http://') || logoUrl.startsWith('https://')
        ? logoUrl
        : `/${logoUrl}`;

    const desiredHeight = 50; // Your desired fixed height
    // Provide a generous width. This width acts as a maximum boundary.
    // The image will scale proportionally to fit within this width AND the desiredHeight,
    // due to `objectFit: 'contain'`. A width of 150px allows for logos
    // that are significantly wider than they are tall (e.g., 3:1 aspect ratio)
    // to fit at 50px height without being cut off.
    const boundingWidth = 150;

    return (
        <Image
            src={processedLogoUrl}
            alt={alt}
            width={boundingWidth} // Required numerical width: This sets the *maximum* width.
            height={desiredHeight} // Required numerical height: This sets the *exact* height.
            style={{
                marginRight: '5px',
                objectFit: 'contain', // Key to maintaining aspect ratio: Scales the image down to fit while preserving its aspect ratio.
                ...style, // Apply any additional styles passed via props,
                maxHeight: '50px',
            }}
            // If the image is crucial and appears above the fold, consider `priority`.
            // priority={true}
        />
    );
};

export default BankLogo;