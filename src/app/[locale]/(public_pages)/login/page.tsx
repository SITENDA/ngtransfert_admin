import PublicWrapper from "@/components/PublicWrapper";
import LoginFormComponent from "@/components/LoginFormComponent";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

export default async function LoginPage() {
    const locale = await getLocale();
    const t = await getTranslations("LoginPage");

    const session = await getSession();

    // ✅ HARD REDIRECT if already logged in
    if (session?.user?.ekiddako) {
        redirect(`/${locale}/${session.user.ekiddako}`);
    }

    return (
        <PublicWrapper>
            <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    {t("title")}
                </h2>
                <LoginFormComponent />
            </div>
        </PublicWrapper>
    );
}
