"use client";
import React from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/ui";

const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn(
                "flex flex-row w-full items-center justify-between gap-2.5",
                className
            )}
            {...props}
            ref={ref}
        />
    );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

interface SelectGroupItemProps extends React.HTMLAttributes<HTMLLIElement> {}

const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
            "flex items-center justify-center w-full py-3 px-3 rounded-lg border border-solid border-light-gray data-[state=checked]:border-primary-02 transition-colors group bg-neutral cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    >
        <p className="text-sm font-sans font-semibold text-light-gray group-data-[state=checked]:text-primary-03">
            {children}
        </p>
        {/* <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            
        </RadioGroupPrimitive.Indicator> */}
    </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
