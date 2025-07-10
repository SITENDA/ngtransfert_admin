"use client";

import * as React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import SignInButton from "./SignInButton";

// Define the type for each item in the carouselItems array
type CarouselItemType = {
    title: string;
    description: string;
};

// Define the Props type for the CarouselSection component
type CarouselSectionProps = {
    carouselItems: CarouselItemType[]; // Use the defined CarouselItemType array
};

const CarouselSection = ({ carouselItems }: CarouselSectionProps) => { // Apply the Props type here
    const [activeIndex, setActiveIndex] = React.useState<number>(0); // Explicitly type useState for clarity

    // Auto-change slides every 5 seconds
    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
        }, 5000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [carouselItems.length]); // Add carouselItems.length to the dependency array

    return (
        <>
            <Carousel className="rounded-lg overflow-hidden">
                <CarouselContent>
                    {carouselItems.map((item, index) => (
                        <CarouselItem
                            key={index}
                            // Using a ternary operator for conditional class names
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
                <SignInButton />
            </div>
        </>
    );
};

export default CarouselSection;