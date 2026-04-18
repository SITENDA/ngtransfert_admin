//  src/components/ProfileImageChanger.tsx

"use client";

import React, { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { buildImageUrl } from "@/util/buildImageUrl";
import { NgtransfertImagesCategory } from "@/enums/NgtransfertImagesCategory";

interface Props {
    profileImageUrl: string;
}

export default function ProfileImageChanger({ profileImageUrl }: Props) {
    const t = useTranslations("UserProfile");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState(profileImageUrl);

    const triggerFileInput = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        startTransition(async () => {
            const res = await fetch("/api/user/profile-image", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                console.error("Profile image upload failed");
                return;
            }

            const json = await res.json();

            if (json.success && json.user?.profileImageUrl) {
                setImageUrl(
                    buildImageUrl(
                        json.user.profileImageUrl,
                        NgtransfertImagesCategory.PROFILE_PICTURES
                    )
                );
            }
        });
    };

    return (
        <div className="flex-shrink-0 flex flex-col items-center">
            <Image
                src={imageUrl}
                alt="User Profile"
                width={120}
                height={120}
                className="w-9 h-9 rounded-full object-cover border"
                unoptimized
            />

            <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                disabled={isPending}
                onClick={triggerFileInput}
            >
                {isPending ? t("uploading") : t("changeProfilePicture")}
            </Button>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
            />
        </div>
    );
}