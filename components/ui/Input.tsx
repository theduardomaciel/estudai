"use client";
import React, { MouseEvent, useId } from "react";

import ArrowIcon from "@material-symbols/svg-600/rounded/chevron_left-fill.svg";

// Styles
import { cn } from "@/lib/ui";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    fixedUnit?: string;
    numberControl?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, fixedUnit, numberControl, type, ...props }, ref) => {
        const id = useId();

        function increaseCount(/* event: MouseEvent<HTMLSpanElement> */) {
            //const button = event.target as HTMLDivElement;
            const input = document.getElementById(id) as HTMLInputElement;

            console.log(input.value.length > 0, parseInt(input.value));
            if (input && input.value.length > 0) {
                input.value = Math.max(0, parseInt(input.value) + 1).toString();
            } else {
                if (input) {
                    input.value = "0";
                }
            }
        }

        function decreaseCount(/* event: MouseEvent<HTMLSpanElement> */) {
            const input = document.getElementById(id) as HTMLInputElement;

            if (input && parseInt(input.value)) {
                input.value = Math.max(0, parseInt(input.value) - 1).toString();
            } else {
                if (input) {
                    input.value = "0";
                }
            }
        }

        function preventText(event: React.ChangeEvent<HTMLInputElement>) {
            const input = event.target as HTMLInputElement;
            const value = input.value;
            const lastChar = value[value.length - 1];
            if (isNaN(parseInt(lastChar))) {
                input.value = value.slice(0, value.length - 1);
            }
        }
        return (
            <div className="relative flex h-10 w-full">
                {numberControl && (
                    <span className="flex flex-col items-center justify-center gap-0 absolute left-3 top-1/2 -translate-y-1/2">
                        <ArrowIcon
                            className="icon rotate-90 cursor-pointer hover:text-primary-02 transition-colors"
                            fontSize={`1.6rem`}
                            color="var(--primary-03)"
                            onClick={increaseCount}
                        />
                        <ArrowIcon
                            className="icon -rotate-90 cursor-pointer hover:text-primary-02 transition-colors"
                            fontSize={`1.6rem`}
                            color="var(--primary-03)"
                            onClick={decreaseCount}
                        />
                    </span>
                )}
                <input
                    id={id}
                    type={numberControl ? "text" : type}
                    className={cn(
                        "flex-1 rounded-md border border-primary-03 bg-neutral px-3 py-2 text-xs ring-offset-red file:border-0 file:bg-transparent text-primary-02 file:text-xs file:font-medium placeholder:text-font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-03 disabled:cursor-not-allowed disabled:opacity-50",
                        {
                            "pr-18": !!fixedUnit,
                        },
                        {
                            "pl-10": !!numberControl,
                        },
                        className
                    )}
                    onChange={numberControl ? preventText : undefined}
                    ref={ref}
                    {...props}
                />
                {fixedUnit && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary-03 select-none pointer-events-none">
                        {fixedUnit}
                    </span>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

// focus-visible:ring-offset-2

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
Root.displayName = "Input.Root";

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
Root.displayName = "Input.Label";

const InputNamespace = Object.assign(Input, { Root: Root, Label: Label });
export { InputNamespace as Input };
