//  /home/amos/docure/ngtransfert_admin/src/app/[locale]/(protected_pages)/layout.tsx

import getSession from "@/lib/getSession";
import { getLocale } from "next-intl/server";
import { ensureValidAccessToken } from "@/lib/server/ensureValidAccessToken";
import {redirect} from "@/i18n/navigation";

export default async function ProtectedLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const session = await getSession();

    if (session == null) {
        redirect({href: "/login?ensobi=signedout", locale});
    }
    else {
        const ok = await ensureValidAccessToken(session);

        if (!session?.user) {
            redirect({href: "/login", locale});
        }

        if (!ok) {
            redirect({href: "/login?ensobi=signedout", locale});
        }

        return <>{children}</>;
    }
}
