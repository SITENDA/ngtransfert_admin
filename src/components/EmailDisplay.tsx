'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface EmailDisplayProps {
    email: string;
}

const EmailDisplay: React.FC<EmailDisplayProps> = ({ email }) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
        <span
            className="cursor-pointer text-sm text-foreground hover:opacity-80"
            onClick={() => setOpen(true)}
        >
          {email}
        </span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Email</DialogTitle>
                </DialogHeader>
                <div className="py-4 text-lg font-medium text-center text-foreground">
                    {email}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EmailDisplay;
