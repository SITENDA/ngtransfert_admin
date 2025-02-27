import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from "@/components/Header";
import FooterAdmin from "@/components/ui/FooterAdmin";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
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

    const { locale } = await params;
    if (!routing.locales.includes(locale as any)) {
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
                    <NextIntlClientProvider messages={messages}>
                    <div className="flex flex-col min-h-screen bg-black bg-home-img bg-cover bg-center">
                        {/*"flex flex-col min-h-screen bg-black bg-home-img bg-cover bg-center"*/}
                        <Header />
                        <main className="flex-grow flex flex-col justify-center text-center max-w-5xl mx-auto w-full pt-10">
                            {children}
                            <Toaster />
                        </main>
                        <FooterAdmin />
                    </div>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
