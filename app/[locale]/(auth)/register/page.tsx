import { Metadata } from "next";
import RegisterForm from "./Form";

export const metadata: Metadata = {
	title: "Register",
	description: "Create a new estudaí account",
};

// Translations
import { useTranslations } from "@/i18n/hooks";

export default function Register({
	searchParams,
	params,
}: {
	searchParams: { code: string };
	params: any;
}) {
	const t = useTranslations();

	return <RegisterForm code={searchParams.code} dict={t.auth} />;
}
