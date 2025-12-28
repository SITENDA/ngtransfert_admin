// src/components/InstructionsClient.tsx
"use client";

import { CardContent, Divider } from "@mui/material";
import React from "react";

export default function InstructionsClient({
                                               children,
                                           }: {
    children: React.ReactNode;
}) {
    return (
        <CardContent className="flex-grow p-6 space-y-8">
            <Divider />
            {children}
        </CardContent>
    );
}