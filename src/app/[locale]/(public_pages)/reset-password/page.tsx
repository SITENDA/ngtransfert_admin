// app/[locale]/reset-password/page.tsx
import ResetPasswordComponent from "@/components/ResetPasswordComponent";
import PublicWrapper from "@/components/PublicWrapper";
import {getTranslations} from "next-intl/server";

export default async function ResetPasswordPage() {

    const t = await getTranslations("ResetPassword");

    return (
        <PublicWrapper>
            <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    {t("title")}
                </h2>
                <ResetPasswordComponent />
            </div>
        </PublicWrapper>
    );
}
