import { Metadata } from "next";

// Icons
import Logo from "/public/logo.svg";

import LoginForm from "./Form";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Login",
	description: "Login to your estudaí account",
};

// Translations
import { useTranslations } from "@/i18n/hooks";

export default function Login({
	params,
	searchParams,
}: {
	params?: { locale?: string };
	searchParams?: { code?: string };
}) {
	const t = useTranslations();

	return (
		<>
			<Link href={`/`}>
				<Logo
					width={121.19}
					height={58.72}
					className="click"
					fill={`var(--primary-02)`}
				/>
			</Link>
			<LoginForm
				code={searchParams?.code}
				dict={t.auth}
				locale={params?.locale}
			/>
		</>
	);
}
