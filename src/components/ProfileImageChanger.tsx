"use client";

import React, { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import {useLocale, useTranslations} from "next-intl";
import { uploadProfileImageAction } from "@/lib/actions/uploadProfileImageAction";
import { useRouter } from "next/navigation";
import {signOut, useSession} from "next-auth/react";
import {generalPaths} from "@/util/frontend-paths";

function ProfileImageChanger({ user }: { user: User }) {
    const t = useTranslations("UserProfile");
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { update } = useSession();
    const locale = useLocale();
    const {data: session} = useSession();

    if (!session || !session.user || !session.accessToken) {
        window.location.replace(`/${locale}${generalPaths.loginPath}?ensobi=signedout`);
        signOut({
            redirect: true,
            callbackUrl: `/${locale}${generalPaths.loginPath}?ensobi=signedout`,
        });
    }

    // NEW: Local image state to update immediately after upload
    const [imageUrl, setImageUrl] = useState<string>(user.profileImageUrl);

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        startTransition(() => {
            uploadProfileImageAction(formData)
                .then(res => {
                    if (res.success && res.updatedUser?.profileImageUrl) {
                        console.log("Uploaded successfully:", res.updatedUser.profileImageUrl);
                        // Inside your success handler:
                        if (res.success && res.updatedUser) {
                            update({
                                user: {
                                    ...res.updatedUser,
                                },
                            });
                        }
                        setImageUrl(res.updatedUser.profileImageUrl);
                        router.refresh();
                    } else {
                        console.error("Failed to update profile image:", res.message);
                    }
                })
                .catch(err => {
                    console.error("Unexpected error:", err);
                });
        });
    };

    return (
        <div className="flex-shrink-0 flex flex-col items-center">
            <Image
                src={imageUrl}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover border border-gray-300 dark:border-gray-600"
                unoptimized
            />
            <Button
                variant="secondary"
                size="sm"
                className="text-sm mt-4"
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
                style={{ display: "none" }}
            />
        </div>
    );
}

export default ProfileImageChanger;
