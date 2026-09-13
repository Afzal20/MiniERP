"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { currencies } from "@/lib/currencies";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

type CurrencySelectProps = {
    value: string;
    onChange: (currency: string) => void;
    disabled?: boolean;
};

export function CurrencySelect({
    value,
    onChange,
    disabled,
}: CurrencySelectProps) {
    const selected = currencies.find(c => c.value === value);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className="w-full justify-between"
                >
                    {selected ? selected.label : "Select currency"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search currency..." />
                    <CommandEmpty>No currency found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                        {currencies.map(currency => (
                            <CommandItem
                                key={currency.value}
                                value={currency.value}
                                onSelect={() => onChange(currency.value)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        currency.value === value
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {currency.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
