"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import GoogleLogo from "/public/google_logo.svg";

import Button from "@/components/Button";

interface Props {
	onClick?: () => void;
	isLoading?: boolean;
	dict: any;
}

export function GoogleProvider({ children }: { children: React.ReactNode }) {
	return (
		<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID!}>
			{children}
		</GoogleOAuthProvider>
	);
}

export function GoogleButton({ onClick, isLoading, dict }: Props) {
	return (
		<Button
			onClick={onClick}
			accentColor="var(--primary-02)"
			isLoading={isLoading}
			style={{
				padding: "1.2rem",
				gap: "3rem",
				backgroundColor: "var(--neutral)",
				border: "1px solid var(--light-gray)",
				color: "var(--font-light)",
				fontFamily: "var(--font-inter)",
				width: "100%",
				fontWeight: 500,
				fontSize: "1.4rem",
				boxShadow: "0px 4px 15px 2px rgba(0, 0, 0, 0.1)",
			}}
		>
			<GoogleLogo />
			{dict ? dict.google_login_button : "Sign in with Google"}
		</Button>
	);
}
