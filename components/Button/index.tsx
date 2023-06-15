"use client";

import React from "react";
import Spinner from "../Spinner";

import styles from "./button.module.css";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string;
	isLoading?: boolean;
	accentColor?: string;
	preset?: "primary" | "neutral" | "sendForm" | "fillHover";
};

export default function Button({
	disabled,
	isLoading,
	accentColor,
	preset = "primary",
	className,
	children,
	...rest
}: ButtonProps) {
	return (
		<button
			type={preset === "sendForm" ? "submit" : "button"}
			className={`button ${styles.button} ${
				preset ? styles[preset] : ""
			} ${isLoading ? styles.disabled : ""} ${className}`}
			disabled={disabled || isLoading}
			{...rest}
		>
			{isLoading ? (
				<Spinner
					classes={styles.hovered}
					color={accentColor ?? "var(--neutral)"}
				/>
			) : (
				<>{children && children}</>
			)}
		</button>
	);
}
