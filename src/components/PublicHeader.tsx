"use client";

import { LogIn, Mail, Info } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { LocaleToggle } from "@/components/LocaleToggle";
import { Button } from "@/components/ui/button";
import transparentIcon from "@/app/[locale]/favicon-transparent.png";
import { useTranslations } from "next-intl";
import { generalPaths } from "@/util/frontend-paths";

export default function PublicHeader() {
    const t = useTranslations("PublicHeader");

    return (
        <header className="bg-background border-b shadow-sm sticky top-0 z-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href={generalPaths.welcomePath}
                        className="flex items-center gap-2 shrink-0"
                        title="NG Transfert"
                    >
                        <Image
                            src={transparentIcon}
                            alt="NG Transfert Logo"
                            width={48}
                            height={48}
                            className="h-10 w-10 object-contain"
                        />
                        <span className="hidden sm:block text-xl font-bold">
                            NG Transfert
                        </span>
                    </Link>

                    {/* Right actions */}
                    <nav className="flex items-center gap-2 sm:gap-4">
                        {/* About Us */}
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            aria-label={t("aboutUs")}
                        >
                            <Link href={generalPaths.aboutUsPath}>
                                <Info className="h-5 w-5" />
                            </Link>
                        </Button>

                        {/* Contact */}
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            aria-label={t("contact")}
                        >
                            <Link href={generalPaths.contactPath}>
                                <Mail className="h-5 w-5" />
                            </Link>
                        </Button>

                        {/* Login */}
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            aria-label={t("login")}
                        >
                            <Link href={generalPaths.loginPath}>
                                <LogIn className="h-5 w-5" />
                            </Link>
                        </Button>

                        {/* Theme */}
                        <ModeToggle
                            label={t("theme")}
                            themeNames={{
                                light: t("themeLight"),
                                dark: t("themeDark"),
                                system: t("themeSystem"),
                            }}
                        />

                        {/* Locale */}
                        <LocaleToggle label={t("language")} />
                    </nav>
                </div>
            </div>
        </header>
    );
}
