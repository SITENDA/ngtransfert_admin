// src/app/[locale]/layout.tsx

import type { Metadata } from "next";
import "@/app/[locale]/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/toaster";
import FooterAdmin from "@/components/ui/FooterAdmin";

export const metadata: Metadata = {
    title: {
        template: "%s | NG Transfert",
        default: "NG Transfert",
    },
    description:
        "Client portal for NG Transfert, a money transfer company between China and Africa.",
};

export default async function RootLayout({
                                             children,
                                             params,
                                         }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as "en" | "fr" | "zh")) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
        <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextIntlClientProvider messages={messages}>
                {children}
                <Toaster />
                <FooterAdmin />
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
