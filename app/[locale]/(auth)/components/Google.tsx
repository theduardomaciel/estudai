"use client";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Icons
import GoogleLogo from "/public/google_logo.svg";

// Components
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
		<Button onClick={onClick} isLoading={isLoading} preset="neutral">
			<GoogleLogo />
			{dict ? dict.google_login_button : "Sign in with Google"}
		</Button>
	);
}
