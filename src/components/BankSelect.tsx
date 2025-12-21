"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Bank } from "../../types/bank";
import { BankOption } from "@/components/BankOption";

interface BankSelectProps {
    banks: Bank[];
    value?: number | null;
    onChangeAction: (value: number) => void;
    placeholder?: string;
}

export function BankSelect({
                               banks,
                               value,
                               onChangeAction,
                               placeholder = "Select a bank",
                           }: BankSelectProps) {
    return (
        <Select
            value={value?.toString()}
            onValueChange={(val) => onChangeAction(Number(val))}
        >
            <SelectTrigger
                className="
                    w-full
                    min-h-[48px]
                    h-12
                    bg-background
                    text-foreground
                    border-border
                    focus:ring-2
                    focus:ring-primary
                    overflow-hidden
                "
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent
                className="
                    bg-background
                    text-foreground
                    border
                    border-border
                    shadow-lg
                "
            >
                {banks.map((bank) => (
                    <SelectItem
                        key={bank.bankId}
                        value={bank.bankId.toString()}
                        className="
                            cursor-pointer
                            focus:bg-accent
                            focus:text-accent-foreground
                            data-[state=checked]:bg-accent
                            py-2
                        "
                    >
                        <BankOption bank={bank} />
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

