// src/app/[locale]/(public_pages)/oauth2/session/update/page.tsx
import SessionUpdateHandler from "@/components/SessionUpdateHandler";

export default function UpdateSessionPage({ searchParams }: { searchParams: { token?: string; user?: string } }) {
    return <SessionUpdateHandler token={searchParams.token} user={searchParams.user} />;
}
