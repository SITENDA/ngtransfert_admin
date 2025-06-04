// app/[locale]/login/page.tsx
// This is a Server Component, notice no "use client"
import PublicWrapper from "@/components/PublicWrapper";
import LoginFormComponent from "@/components/LoginFormComponent"; // Import the client component
// import { getTranslations } from 'next-intl/server'; // Import for server-side translations if needed
import React from 'react'; // React is still needed for JSX

export const metadata = {
    title: "Login / Register | NG Transfert", // Add a more specific title
};

interface LoginPageProps {
    // You can define params here if your route has them, e.g.:
    // params: { locale: string };
}

export default async function LoginPage({}: LoginPageProps) {
    // Example of fetching server-side translations if you needed to pass them down
    // const t = await getTranslations('LoginPage');

    return (
        <PublicWrapper>
            {/* Render the Client Component as an "island of interactivity" */}
            <LoginFormComponent
                /* Pass any necessary props from the server component here, e.g.:
                t={t} */
            />
        </PublicWrapper>
    );
}