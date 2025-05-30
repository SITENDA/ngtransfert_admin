"use client";

import * as React from "react";
// import Link from "next/link";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import SignInButton from "./SignInButton";

type Props = {
    carouselItems: {
        title: string, 
        description: string,
    }[]
}

const CarouselSection = ({ carouselItems }: Props) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    // Auto-change slides every 5 seconds
    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
        }, 5000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <>
            <Carousel className="rounded-lg overflow-hidden">
                <CarouselContent>
                    {carouselItems.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className={`transition-opacity duration-1000 ${
                                index === activeIndex ? "opacity-100" : "opacity-0 absolute"
                            }`}
                        >
                            <h4 className="text-white text-2xl font-semibold mb-3">
                                {item.title}
                            </h4>
                            <p className="text-white/80 text-lg bg-[#230a84]/50 p-4 rounded-lg">
                                {item.description}
                            </p>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="mt-6">
                {/*<Link href="/login">Sign In</Link>*/}
                {/* <Button asChild className="px-6 py-3 text-lg font-bold">
                    <LoginLink>Sign In</LoginLink>
                </Button> */}
                <SignInButton/>
            </div>
        </>
    );
};

export default CarouselSection;