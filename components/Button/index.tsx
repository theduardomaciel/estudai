"use client";
import React from "react";

// Components
import Spinner from "../Spinner";

// Styles
import { cn } from "@/lib/ui";
import { DEFAULT, presets } from "./button.classes";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	isLoading?: boolean;
	preset?: keyof typeof presets | (keyof typeof presets)[] | null;
};

export default function Button({
	disabled,
	isLoading,
	preset = "primary",
	className,
	children,
	...rest
}: ButtonProps) {
	return (
		<button
			type={preset === "sendForm" ? "submit" : "button"}
			className={cn(
				DEFAULT,
				typeof preset === "string"
					? presets[preset]
					: preset
					? preset.map((t) => presets[t])
					: "",
				className
			)}
			disabled={disabled || isLoading}
			{...rest}
		>
			{isLoading ? (
				<Spinner
					color={
						preset === "neutral"
							? "var(--primary-02)"
							: "var(--neutral)"
					}
				/>
			) : (
				<>{children && children}</>
			)}
		</button>
	);
}
