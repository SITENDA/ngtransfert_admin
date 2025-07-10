// src/components/banks/ImageDisplay.tsx (if needed for the main label of the select)
import Image from 'next/image';
import React from 'react';

interface ImageDisplayProps {
    imageUrl?: string | null;
    title: string;
    style?: React.CSSProperties;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, title, style }) => {
    if (!imageUrl) return null;
    return <Image src={imageUrl} alt={title} width={24} height={24} style={style} />;
};

export default ImageDisplay;