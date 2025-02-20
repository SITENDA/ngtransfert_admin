import CarouselSection from "@/components/CarouselSection";
import PublicWrapper from "@/components/PublicWrapper";
import * as React from "react";
// import Link from "next/link";

export const metadata = {
    title: "Home Page | NG Transfert",
}

export default function Home() {
    return (
        <PublicWrapper>
            <CarouselSection/>
            <p className="mt-6 text-sm text-white">
                <span className="italic">New at NG Transfert?</span><br/>
                {/*<Link href="/register" className="text-blue-400 hover:underline text-base">*/}
                {/*    Register*/}
                {/*</Link>*/}
                {/* <RegisterLink>Register</RegisterLink> */}
            </p>
        </PublicWrapper>

    );
}