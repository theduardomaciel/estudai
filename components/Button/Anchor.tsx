import React from "react";
import Link, { LinkProps } from "next/link";

// Styles
import { DEFAULT, presets } from "./button.classes";
import { cn } from "@/lib/ui";

interface Props extends LinkProps {
	children: React.ReactNode;
	className?: string;
	preset?: keyof typeof presets;
}

export default function Anchor({
	children,
	preset = "primary",
	className,
	...rest
}: Props) {
	return (
		<Link className="flex-1" {...rest}>
			<button className={cn(DEFAULT, presets[preset], className)}>
				{children}
			</button>
		</Link>
	);
}
