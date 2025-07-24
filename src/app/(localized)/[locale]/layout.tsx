import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/(localized)/[locale]/globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound, } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from "@/components/Header";
import {Toaster} from "@/components/ui/toaster";
import FooterAdmin from "@/components/ui/FooterAdmin";
import { SessionProvider } from 'next-auth/react'; // From next-auth
import { AuthProvider } from '@/context/AuthContext'; // Your custom AuthContext



// --- Define your local Geist Sans font ---
const geistSans = localFont({
    src: [
        // Adjust these paths based on the actual location of your layout.tsx
        // relative to your `src/fonts/Geist/` directory.
        // If layout.tsx is in `app/[locale]/`, and fonts are in `src/fonts/`,
        // the path will be `../../../src/fonts/Geist/`.
        {
            path: '../../../../src/fonts/Geist/Geist-Thin.ttf',
            weight: '100',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/Geist/Geist-ExtraLight.ttf',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/Geist/Geist-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/Geist/Geist-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/Geist/Geist-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/Geist/Geist-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/Geist/Geist-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/Geist/Geist-ExtraBold.ttf',
            weight: '800',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/Geist/Geist-Black.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: "--font-geist-sans",
    display: 'swap', // 'swap' is generally recommended for performance and user experience
});


// --- Define your local Geist Mono font ---
const geistMono = localFont({
    src: [
        // Adjust these paths similarly to Geist Sans,
        // relative to your `src/fonts/GeistMono/` directory.
        {
            path: '../../../../src/fonts/GeistMono/GeistMono-Thin.ttf',
            weight: '100',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/GeistMono/GeistMono-ExtraLight.ttf',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/GeistMono/GeistMono-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/GeistMono/GeistMono-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/GeistMono/GeistMono-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/GeistMono/GeistMono-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/GeistMono/GeistMono-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/GeistMono/GeistMono-ExtraBold.ttf',
            weight: '800',
            style: 'normal',
        },
        {
            path: '../../../../src/fonts/GeistMono/GeistMono-Black.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: "--font-geist-mono",
    display: 'swap',
});


export const metadata: Metadata = {
    title: {
        template: '%s | NG Transfert',
        default: "NG Transfert",
    },
    description: "This is the client's portal website for NG Transfert, a money transfer company dealing in sending and receiving money between China and Africa.",
    applicationName: "NG Transfert",
};

export default async function RootLayout({
                                             children,
                                             params
                                         }: {
    children: React.ReactNode;
    params: Promise<{locale: string}>;
}) {

    const { locale } =  await params;
    if (!routing.locales.includes(locale as "en" | "fr" | "zh")) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();


    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>
                <NextIntlClientProvider messages={messages}>
                    <Header />
                    <main className="flex-grow flex flex-col min-h-screen justify-center text-center w-full pt-10 bg-black bg-home-img bg-cover bg-center">
                        {/*flex flex-col min-h-screen bg-black bg-home-img bg-cover bg-center*/}
                        <AuthProvider>
                            {children}
                            <Toaster />
                        </AuthProvider>
                    </main>
                    <FooterAdmin />
                </NextIntlClientProvider>
            </SessionProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}