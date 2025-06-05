// app/[locale]/(public_pages)/oauth2/redirect/page.tsx
// No 'use client' here, so it's a Server Component

import OAuth2Handler from './OAuth2Handler'; // Import the Client Component

// Define the props for a Server Component page in App Router
interface OAuth2RedirectPageProps {
    params: {
        locale: string; // Next.js automatically provides the 'locale' from the URL segment
    };
}

export default function OAuth2RedirectPage({ params }: OAuth2RedirectPageProps) {
    const { locale } = params;

    // Render the Client Component and pass the locale to it
    return <OAuth2Handler locale={locale} />;
}