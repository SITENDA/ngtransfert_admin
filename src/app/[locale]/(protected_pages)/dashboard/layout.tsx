import Header from "@/components/Header";
import FooterAdmin from "@/components/ui/FooterAdmin";
import { Toaster } from "@/components/ui/toaster";

export default async function PublicLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {

    return (
        <div className="flex flex-col min-h-screen bg-[#230a84]/50 bg-cover bg-center">
            <Header />
            <main className="flex-grow flex flex-col justify-center text-center max-w-5xl mx-auto w-full pt-10">
                {children}
                <Toaster />
            </main>
            <FooterAdmin />
        </div>
    );
}