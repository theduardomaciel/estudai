"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Stylesheets
import styles from "../styles.module.css";

// Components
import Button from "@/components/ui/Button";
import Separator from "@/components/Separator";
import { Error, ScopeMissing } from "../components/Sections";

// Authentication
import { signIn } from "@/lib/auth";
import { GoogleButton } from "../components/Google";
import { useGoogleLogin } from "@react-oauth/google";

interface Props {
	code?: string;
	dict: any;
	locale?: string;
}

export default function LoginForm({ code, dict, locale }: Props) {
	const [isLoading, setLoading] = useState(code ? true : false);
	const [section, setSection] = useState<string | null>(null);

	const router = useRouter();
	const t = dict.login;

	const googleLogin = useGoogleLogin({
		onError(errorResponse) {
			console.log(errorResponse);
			setLoading(false);
		},
		onNonOAuthError(nonOAuthError) {
			console.log(nonOAuthError);
			setLoading(false);
		},
		scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
		flow: "auth-code",
		ux_mode: "redirect",
		redirect_uri:
			process.env.NEXT_PUBLIC_NODE_ENV === "development"
				? `http://localhost:3000/login`
				: `https://estudai.vercel.app/login`,
		state: locale,
	});

	function toggleFullScreen() {
		const container = document.getElementById("authMainContainer");
		if (container) {
			container.classList.toggle(styles.fullscreen);
		}
	}

	async function authAfterRedirect() {
		console.log(code);
		if (code) {
			const response = await signIn(code as string); // success | noAccount | scopeMissing

			if (response === "success") {
				router.push(`/home`);
			} else {
				setSection(response);
				toggleFullScreen();
			}
		}
	}

	useEffect(() => {
		authAfterRedirect();
	}, []);

	return !section ? (
		<>
			<header>
				<h1>{t.title}</h1>
				<p>{t.subtitle}</p>
			</header>
			<GoogleButton
				isLoading={isLoading}
				onClick={() => {
					googleLogin();
					setLoading(true);
				}}
				dict={dict}
			/>
			<Separator
				style={{ backgroundColor: "var(--primary-02)", width: "10rem" }}
				orientation="horizontal"
			/>
			<Link href={"/register"}>
				<p className={`${styles.outro} ${styles.static}`}>
					{t.footer.no_account} {` `}
					<span className={`bold ${styles.outro}`}>
						{t.footer.register}
					</span>
				</p>
			</Link>
		</>
	) : section === "noAccount" ? (
		<div className={styles.section}>
			<header>
				<h1>{t.no_account.title}</h1>
				<p style={{ whiteSpace: "pre-line" }}>
					{t.no_account.subtitle}
				</p>
			</header>
			<Link href={"/register"} style={{ width: "100%" }}>
				<Button style={{ padding: "1rem 1.5rem", width: "100%" }}>
					{t.no_account.button}
				</Button>
			</Link>
			<Separator
				style={{ backgroundColor: "var(--primary-02)", width: "10rem" }}
				orientation="horizontal"
			/>
		</div>
	) : section === "scopeMissing" ? (
		<ScopeMissing
			setSection={() => {
				setSection(null);
				setLoading(false);
				toggleFullScreen();
			}}
			dict={dict}
		/>
	) : (
		<Error
			setSection={() => {
				setSection(null);
				setLoading(false);
				toggleFullScreen();
			}}
			dict={dict}
		/>
	);
}
