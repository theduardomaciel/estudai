"use client";
import React, { MouseEvent, useId } from "react";

import PlusIcon from "@material-symbols/svg-600/rounded/add.svg";
import MinusIcon from "@material-symbols/svg-600/rounded/remove.svg";

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
                    input.value = "1";
                }
            }
        }

        function decreaseCount(/* event: MouseEvent<HTMLSpanElement> */) {
            const input = document.getElementById(id) as HTMLInputElement;

            if (input && (parseInt(input.value) ?? 0) - 1 > 0) {
                input.value = Math.max(0, parseInt(input.value) - 1).toString();
            } else {
                if (input) {
                    input.value = "";
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
            <div className="relative flex flex-row items-center justify-between gap-2.5 h-10 w-full">
                <div className="flex flex-1 h-full relative">
                    <input
                        id={id}
                        type={numberControl ? "text" : type}
                        className={cn(
                            "flex-1 h-full rounded-md border border-primary-03 bg-neutral px-3 py-2 text-xs ring-offset-red file:border-0 file:bg-transparent text-primary-02 file:text-xs file:font-medium placeholder:text-font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-03 disabled:cursor-not-allowed disabled:opacity-50",
                            /* {
                                "pr-18": !!fixedUnit,
                            }, */
                            className
                        )}
                        onChange={numberControl ? preventText : undefined}
                        ref={ref}
                        {...props}
                    />
                    {fixedUnit && (
                        <span className="flex items-center justify-center h-[calc(100%-0.5rem)] pl-2.5 pr-1 bg-neutral absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary-03 select-none pointer-events-none">
                            {fixedUnit}
                        </span>
                    )}
                </div>
                {numberControl && (
                    <div className="flex flex-row items-center justify-center gap-0 h-full rounded-md bg-neutral border border-primary-04 overflow-hidden">
                        <button
                            className="flex items-center justify-center flex-1 h-full px-2.5 cursor-pointer hover:bg-background-04 transition-colors"
                            onClick={decreaseCount}
                        >
                            <MinusIcon
                                className="icon"
                                fontSize={`2.4rem`}
                                color="var(--primary-03)"
                            />
                        </button>
                        <div className="w-0 h-full border-r border-r-background-01" />
                        <button
                            className="flex items-center justify-center px-2.5 flex-1 h-full cursor-pointer hover:bg-background-04 transition-colors"
                            onClick={increaseCount}
                        >
                            <PlusIcon
                                className="icon"
                                fontSize={`2.4rem`}
                                color="var(--primary-03)"
                            />
                        </button>
                    </div>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
