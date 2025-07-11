// app/[locale]/(protected_pages)/layout.tsx
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { User } from "next-auth";
import {getLocale} from "next-intl/server"; // <-- Import headers here

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export default async function ProtectedLayout({
                                                  children,
                                              }: ProtectedLayoutProps) {
    const session = await getSession();
    const user: User | undefined = session?.user;
    const accessToken: string | undefined = session?.accessToken;
    console.log("Token is : ", accessToken, "\n\n User is : ", user);
    const locale = await getLocale();

    if (!session || !user) {
        // console.warn(`Protected Layout: User is not authenticated for locale '${paramsToUse.locale}'. Redirecting to login.`);
        redirect(`/${locale}/login`);
    }

    return <>{children}</>;
}