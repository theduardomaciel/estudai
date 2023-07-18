"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import CheckIcon from "@material-symbols/svg-600/rounded/check-fill.svg";

import { cn } from "@/lib/ui";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-primary-03 bg-neutral px-3 py-2 text-xs text-primary-03 ring-offset-red placeholder:text-font-light focus:outline-none focus:ring-2 focus:ring-primary-03 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={cn(
                "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-neutral text-font-light shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                position === "popper" &&
                    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                className
            )}
            position={position}
            {...props}
        >
            <SelectPrimitive.Viewport
                className={cn(
                    "p-1",
                    position === "popper" &&
                        "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                )}
            >
                {children}
            </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={cn(
            "py-1.5 pl-8 pr-2 text-sm font-semibold text-primary-03",
            className
        )}
        {...props}
    />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs outline-none focus:bg-background-04 focus:text-font-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <CheckIcon className="icon" fontSize={"1.6rem"} />
            </SelectPrimitive.ItemIndicator>
        </span>

        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-light-gray", className)}
        {...props}
    />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Root = ({ className, children, ...props }: RootProps) => {
    return (
        <div
            className={cn(
                "flex flex-col gap-1.5 items-start relative w-full min-h-fit",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
Root.displayName = "Select.Root";

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {}

export const Label = ({ className, children, ...props }: LabelProps) => {
    return (
        <label
            className={cn(
                "font-karla font-bold text-sm text-primary-03 select-none pointer-events-none",
                className
            )}
            {...props}
        >
            {children}
        </label>
    );
};
Root.displayName = "Select.Label";

const SelectNamespace = Object.assign(Select, { Root: Root, Label: Label });

export {
    SelectNamespace as Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
};
