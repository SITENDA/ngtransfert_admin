'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { updateUserProfileAction } from "@/lib/actions/userActions";
import { cn } from '@/lib/utils';

export default function UserDetailsCard() {
    const t = useTranslations('UserDetailsCard');
    const { data: session } = useSession();
    const user = session?.user;

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        username: user?.username || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const toggleExpand = () => {
        setExpanded(!expanded);
        setIsEditing(false);
        setMessage('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updateUserProfileAction(formData);
            setMessage(result?.message || t('profileUpdated'));
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setMessage(t('updateFailed'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mb-4">
            <Button
                variant={expanded ? 'secondary' : 'outline'}
                size="sm"
                onClick={toggleExpand}
                className="mb-4"
            >
                {expanded ? t('cancel') : t('viewDetails')}
            </Button>

            {expanded && (
                <Card className="bg-background/80 backdrop-blur-md border border-border shadow-md dark:bg-gray-800/80 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                            {t('yourDetails')}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {['fullName', 'username', 'email', 'phoneNumber'].map(field => (
                            <div key={field}>
                                <Label htmlFor={field}>{t(field)}</Label>
                                <Input
                                    id={field}
                                    name={field}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    type={field === 'email' ? 'email' : 'text'}
                                    className="w-full"
                                />
                            </div>
                        ))}

                        <div>
                            <Label>{t('registeredOn')}</Label>
                            <p className="text-muted-foreground">
                                {new Date(user?.registrationDate || '').toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            {isEditing ? (
                                <>
                                    <Button onClick={handleSave} disabled={saving}>
                                        {saving ? t('saving') : t('saveChanges')}
                                    </Button>
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                        {t('cancel')}
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>{t('edit')}</Button>
                            )}
                        </div>

                        {message && (
                            <p className={cn("text-sm", message.includes("success") ? "text-green-500" : "text-red-500")}>
                                {message}
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
