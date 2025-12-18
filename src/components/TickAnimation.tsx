"use client";

import React from "react";
import { useTheme } from "next-themes";
import "@/css/TickAnimation.css";

interface TickAnimationProps {
    successMessage: string;
}

export default function TickAnimation({ successMessage }: TickAnimationProps) {
    const { theme } = useTheme();

    const isDark = theme === "dark";

    return (
        <div
            className="wrapper"
            style={{
                backgroundColor: isDark ? "hsl(var(--background))" : "hsl(var(--background))",
                color: isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
            }}
        >
            <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
            >
                <circle
                    className="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                />
                <path
                    className="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
            </svg>

            <div className="success-message">{successMessage}</div>
        </div>
    );
}
