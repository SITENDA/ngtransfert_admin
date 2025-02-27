import * as React from "react";
import PublicWrapper from "@/components/PublicWrapper";
import ContactUsForm from "@/app/[locale]/(public_pages)/contact/ContactUsForm";

export const metadata = {
    title: "Contact Us",
}

export default function ContactUsPage() {
    return (
        <PublicWrapper>
            <h4 className="text-white text-2xl font-semibold mb-3">
                Contact Us
            </h4>
            <p className="text-white/80 text-lg bg-[#230a84]/50 p-4 rounded-lg">
            Ready to start your next project with us? Send us a messages and we will get back to you as soon as possible!
            </p>
            <ContactUsForm/>
        </PublicWrapper>

    );
}