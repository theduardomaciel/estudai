"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import CheckIcon from "@material-symbols/svg-600/rounded/check_small.svg";

import { cn } from "@/lib/ui";

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-03 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-light-gray data-[state=checked]:border-font-light",
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            className={cn("flex items-center justify-center text-current")}
        >
            <CheckIcon
                className="icon h-3 w-3"
                color="var(--font-dark-02)"
                fontSize={`1.2rem`}
            />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
