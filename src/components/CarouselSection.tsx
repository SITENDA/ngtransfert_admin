"use client";

import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import SignInButton from "./SignInButton";

type CarouselItemType = {
    title: string;
    description: string;
};

type CarouselSectionProps = {
    carouselItems: CarouselItemType[];
};

const CarouselSection = ({ carouselItems }: CarouselSectionProps) => {
    const [activeIndex, setActiveIndex] = React.useState<number>(0);

    // Auto-change slides every 5 seconds
    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % carouselItems.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [carouselItems.length]);

    return (
        <div className="flex flex-col justify-center items-center min-h-[320px] text-center">
            <Carousel className="w-full rounded-lg overflow-hidden">
                <CarouselContent>
                    {carouselItems.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className={`transition-opacity duration-1000 ${
                                index === activeIndex
                                    ? "opacity-100"
                                    : "opacity-0 absolute"
                            }`}
                        >
                            <div className="flex flex-col items-center gap-5">
                                {/* Title */}
                                <h4 className="text-white text-2xl md:text-3xl font-semibold">
                                    {item.title}
                                </h4>

                                {/* Description */}
                                <p className="text-white/80 text-base md:text-lg bg-[#230a84]/50 px-6 py-4 rounded-lg max-w-2xl">
                                    {item.description}
                                </p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Sign in button */}
            <div className="mt-8">
                <SignInButton />
            </div>
        </div>
    );
};

export default CarouselSection;
