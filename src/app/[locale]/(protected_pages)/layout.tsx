// app/[locale]/(protected_pages)/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User } from "next-auth";
import { headers } from 'next/headers'; // <-- Import headers here

interface ProtectedLayoutProps {
    children: React.ReactNode;
    params: { locale: string };
}

export default async function ProtectedLayout({
                                                  children,
                                                  params,
                                              }: ProtectedLayoutProps) {
    const session = await auth();
    const user: User | undefined = session?.user;

    // --- CORRECTED WAY TO GET PATHNAME IN A SERVER COMPONENT ---
    const headerStore = await headers();
    const currentPathname = headerStore.get('x-pathname') || ''; // 'x-pathname' header usually contains the full path
    
    const paramsToUse = await params;
    // Extract the path without the locale prefix for logging clarity
    const pathWithoutLocale = currentPathname.startsWith(`/${paramsToUse.locale}/`)
        ? currentPathname.substring(`/${paramsToUse.locale}/`.length)
        : currentPathname;
    // --- END CORRECTION ---

    console.log(`Protected Layout for locale '${paramsToUse.locale}': Checking authentication for path: /${pathWithoutLocale}. User:`, user ? user.email || user.id || 'Authenticated' : 'Unauthenticated');


    if (!session || !user) {
        // console.warn(`Protected Layout: User is not authenticated for locale '${paramsToUse.locale}'. Redirecting to login.`);
        redirect(`/${paramsToUse.locale}/login`);
    }

    return <>{children}</>;
}