//  /home/amos/docure/ngtransfert_admin/src/app/[locale]/(protected_pages)/layout.tsx

import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { ensureValidAccessToken } from "@/lib/server/ensureValidAccessToken";

export default async function ProtectedLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const session = await getSession();

    if (!session?.user) {
        redirect(`/${locale}/login`);
    }

    const ok = await ensureValidAccessToken(session);

    if (!ok) {
        redirect(`/${locale}/login?ensobi=signedout`);
    }

    return <>{children}</>;
}
