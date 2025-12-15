// src/components/banks/ImageDisplay.tsx (if needed for the main label of the select)

'use client';

import React, {useEffect, useState} from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImageDisplayProps {
    imageUrl?: string;
    title?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, title }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        console.log("imageUrl : ", imageUrl);
    }, [imageUrl]);

    const urlToUse =
        imageUrl && imageUrl.startsWith('http')
            ? imageUrl
            : imageUrl
                ? imageUrl
                : null;

    if (!urlToUse) {
        return <p className="text-muted-foreground">No image available</p>;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <img
                    src={urlToUse}
                    alt={title || 'Image'}
                    className="w-12 h-12 object-cover rounded cursor-pointer border border-border"
                    onClick={() => setOpen(true)}
                />
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title || 'Image Preview'}</DialogTitle>
                </DialogHeader>
                <div className="w-full max-h-[80vh] overflow-auto rounded border">
                    <img
                        src={urlToUse}
                        alt={title || 'Preview'}
                        className="w-full object-contain"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="mt-4"
                >
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ImageDisplay;































//  Old Image display - wasn't used anywhere before using this version from my old react/redux code typescript version.

// import Image from 'next/image';
// import React from 'react';
//
// interface ImageDisplayProps {
//     imageUrl?: string | null;
//     title: string;
//     style?: React.CSSProperties;
// }
//
// const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, title, style }) => {
//     if (!imageUrl) return null;
//     return <Image src={imageUrl} alt={title} width={24} height={24} style={style} />;
// };
//
// export default ImageDisplay;