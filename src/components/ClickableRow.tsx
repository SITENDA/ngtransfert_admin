import React from 'react';
import { Link } from "@/i18n/navigation"; // Assuming this Link is available in your full Next.js environment

// Define the interface for the ClickableRow component's props
interface ClickableRowProps {
    children: React.ReactNode; // Can be any valid React child (text, other components, etc.)
    count: number;             // The count to display, expected to be a number
    href: string;              // The URL string for navigation
    className?: string;        // Optional additional CSS classes, expected to be a string
}

// Helper for "clickable" rows - in a real Next.js app, this would be a <Link> component
export const ClickableRow = ({ children, count, href, className = '' }: ClickableRowProps) => {
    return (
        // The Link component from Next.js for client-side navigation
        // In this isolated environment, this import may still cause compilation errors,
        // but in a full Next.js app, this is the correct usage.
        <Link href={href} passHref>
            <div
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition duration-200 ease-in-out shadow-sm
                           bg-gray-50 dark:bg-gray-700
                           hover:bg-blue-50 dark:hover:bg-blue-900 ${className}`}
            >
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{children}</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{count}</span>
            </div>
        </Link>
    );
};
