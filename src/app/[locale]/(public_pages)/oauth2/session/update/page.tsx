// src/app/[locale]/(public_pages)/oauth2/session/update/page.tsx
import SessionUpdateHandler from "@/components/SessionUpdateHandler";

interface UpdateSessionSearchParams {
    user?: string;
}

export default async function UpdateSessionPage({
                                                    searchParams,
                                                }: {
    searchParams: Promise<UpdateSessionSearchParams>;
}) {
    const params = await searchParams;

    return <SessionUpdateHandler user={params.user} />;
}