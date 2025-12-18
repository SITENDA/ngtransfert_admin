"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { updateUserProfileAction } from "@/lib/actions/updateUserProfileAction";
import { cn } from "@/lib/utils";

interface Props {
    user: {
        userId: number;
        fullName?: string;
        username: string;
        email?: string;
        phoneNumber?: string;
        registrationDate?: string;
    };
}

export default function UserDetailsCard({ user }: Props) {
    const t = useTranslations("UserDetailsCard");

    const [formData, setFormData] = useState({
        fullName: user.fullName ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
    });

    const [expanded, setExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updateUserProfileAction(formData);
            setMessage(result.message);
            setIsEditing(false);
        } catch {
            setMessage(t("updateFailed"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Button
                variant={expanded ? "secondary" : "outline"}
                size="sm"
                onClick={() => setExpanded(v => !v)}
                className="mb-4"
            >
                {expanded ? t("cancel") : t("viewDetails")}
            </Button>

            {expanded && (
                <Card className="bg-background/80 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle>{t("yourDetails")}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {(["fullName", "username", "email", "phoneNumber"] as const).map(field => (
                            <div key={field}>
                                <Label htmlFor={field}>{t(field)}</Label>
                                <Input
                                    id={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        ))}

                        <div className="flex gap-3 pt-4">
                            {isEditing ? (
                                <>
                                    <Button onClick={handleSave} disabled={saving}>
                                        {saving ? t("saving") : t("saveChanges")}
                                    </Button>
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                        {t("cancel")}
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>
                                    {t("edit")}
                                </Button>
                            )}
                        </div>

                        {message && (
                            <p
                                className={cn(
                                    "text-sm",
                                    message.includes("success") ? "text-green-500" : "text-red-500"
                                )}
                            >
                                {message}
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

