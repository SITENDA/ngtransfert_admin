// src/app/[locale]/(public_pages)/oauth2/session/update/page.tsx
import SessionUpdateHandler from "@/components/SessionUpdateHandler";

export default function UpdateSessionPage({ searchParams }: { searchParams: { user?: string } }) {
    return <SessionUpdateHandler user={searchParams.user} />;
}
