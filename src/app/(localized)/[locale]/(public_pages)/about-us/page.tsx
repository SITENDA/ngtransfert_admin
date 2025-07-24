import * as React from "react";
import PublicWrapper from "@/components/PublicWrapper";

export const metadata = {
    title: "About Us",
}

export default function AboutUsPage() {
    return (
        <PublicWrapper>
            <h4 className="text-white text-2xl font-semibold mb-3">
                About Us
            </h4>
            <p className="text-white/80 text-lg bg-[#230a84]/50 p-4 rounded-lg">
                At NG Transfert, we specialize in providing seamless and rapid international money transfers to meet your business needs. Collaborating closely with partners from various countries around the globe, we ensure smooth transactions that support your financial goals. Whether you need to send or receive funds, our reliable service and extensive network guarantee efficiency and security. Join us today and experience the ease of global money transfers tailored to your requirements.
            </p>
        </PublicWrapper>

    );
}