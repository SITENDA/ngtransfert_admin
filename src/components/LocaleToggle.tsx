"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {JSX} from "react";
// import {setPreference} from "@/lib/client/setPreference";
// import {getSession} from "next-auth/react";

type Props = {
    label: string;
    // userLoggedIn: boolean;
}

type LocaleType = {
    label: string;
    value: string;
}[];

export function LocaleToggle({ label }: Props): JSX.Element {


    const locales: LocaleType = [
        {
            label: "English",
            value: "en",
        },
        {
            label: "Français",
            value: "fr",
        },
        {
            label: "简体中文",
            value: "zh",
        },
    ];

    const [isPending, startTransition] = useTransition()

    const router = useRouter();
    const pathname = usePathname();

    const handleLocaleChange = (locale: string) => {
        const currentPath = pathname.replace(/^\/(en|fr|zh)/, "");
        localStorage.setItem("preferred_locale", locale);

        // if (userLoggedIn) {
        //     // 🔐 Persist preference
        //     setPreference({
        //         identifier: "email",      // or phoneNumber
        //         email: undefined,
        //         key: "language",
        //         value: locale,
        //     });
        // }

        const newPath = `/${locale}${currentPath}`;

        startTransition(() => {
            router.push(newPath);
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label={label} title={label} disabled={isPending}>
                    <span className="sr-only">{ label }</span>
                    🌐
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {locales.map((locale) => (
                    <DropdownMenuItem
                        key={locale.value}
                        onClick={() => handleLocaleChange(locale.value)}
                    >
                        {locale.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}