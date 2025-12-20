import * as React from "react";
import PublicWrapper from "@/components/PublicWrapper";
import { getTranslations } from "next-intl/server";

export const metadata = {
    title: "About Us",
};

export default async function AboutUsPage() {
    const t = await getTranslations("AboutUs");

    return (
        <PublicWrapper>
            <div className="max-w-3xl mx-auto">
                <h4 className="text-white text-2xl font-semibold mb-4">
                    {t("title")}
                </h4>

                <p className="text-white/80 text-lg leading-relaxed bg-[#230a84]/50 p-5 rounded-lg">
                    {t("description")}
                </p>
            </div>
        </PublicWrapper>
    );
}
