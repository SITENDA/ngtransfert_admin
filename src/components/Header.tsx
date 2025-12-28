import { User, Mail, Settings } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import getSession from "@/lib/getSession";
import SignOutButton from "@/components/SignOutButton";
import transparentIcon from "@/app/[locale]/favicon-transparent.png";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { LocaleToggle } from "@/components/LocaleToggle";
import { generalPaths } from "@/util/frontend-paths";
import {SessionCountdown} from "@/components/SessionCountdown";

export default async function Header() {
    const t = await getTranslations("Header");
    const session = await getSession();
    const user = session?.user;

    return (
        <header className="animate-slide bg-background h-20 p-4 border-b sticky top-0 z-20 w-full shadow-md">
            <div className="flex h-full items-center justify-between max-w-screen-xl mx-auto px-6">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2" title="Home">
                    <Image
                        src={transparentIcon}
                        alt="NG Transfert Logo"
                        width={70}
                        height={70}
                        className="h-16 w-16 object-contain"
                    />
                    <h1 className="text-2xl font-bold hidden sm:block">
                        NG Transfert
                    </h1>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-5">

                    <Button asChild variant="ghost" size="icon" title={t("contactUs")}>
                        <Link href={generalPaths.contactPath}>
                            <Mail className="h-5 w-5" />
                        </Link>
                    </Button>

                    <Button asChild variant="ghost" size="icon" title={t("settings")}>
                        <Link href={generalPaths.settingsPath}>
                            <Settings className="h-5 w-5" />
                        </Link>
                    </Button>

                    <ModeToggle
                        label={t("toggleTheme")}
                        themeNames={{
                            light: t("light"),
                            dark: t("dark"),
                            system: t("system"),
                        }}
                    />

                    <LocaleToggle label={t("changeLanguage")} />

                    {user && <SessionCountdown/>}

                    {/* 👤 User profile */}
                    {user && (
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            title={user.fullName}
                            className="rounded-full"
                        >
                            <Link href={generalPaths.userProfilePath}>
                                {user.profileImageUrl ? (
                                    <Image
                                        src={user.profileImageUrl}
                                        alt="User profile"
                                        width={36}
                                        height={36}
                                        className="rounded-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <User className="h-6 w-6" />
                                )}
                            </Link>
                        </Button>
                    )}
                    {/* 🚪 Sign out (right-most) */}
                    {user && (<SignOutButton/>)}
                </nav>
            </div>
        </header>
    );
}
