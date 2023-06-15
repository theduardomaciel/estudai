import React from "react";

import styles from "./button.module.css";
import { cn } from "@/lib/ui";
export const ICON_PROPS = {
	fontSize: "2.4rem",
	color: "var(--neutral)",
	viewBox: "0 0 48 48",
};

interface Props {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export default function RedirectButton({ children, className, style }: Props) {
	return (
		<div
			className={`${styles.button} ${styles.primary} ${className ?? ""}`}
			style={style}
		>
			{children}
		</div>
	);
}
