//  /home/amos/docure/ngtransfert_admin/src/app/[locale]/(public_pages)/layout.tsx

import PublicHeader from "@/components/PublicHeader";

export default function PublicPagesLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PublicHeader />
            <main className="flex-1 w-full bg-black bg-home-img bg-cover bg-center">
                {children}
            </main>
        </>
    );
}
