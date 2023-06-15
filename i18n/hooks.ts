import "server-only";

import { COOKIE_LOCALE_NAME, i18n } from "@/i18n/config";
import { headers } from "next/headers";

import en from "@/i18n/dictionaries/en.json";
import pt_br from "@/i18n/dictionaries/pt-br.json";

export type Translations = typeof en & typeof pt_br;
export const translations = {
	en,
	"pt-BR": pt_br,
};

export const useLocale = () => {
	// We check for a `User-Language` header containing the locale
	const locale = headers().get("User-Language");
	//console.log("Locale from headers: ", locale);

	if (locale)
		return (
			i18n.locales.find((language) => language === locale) ||
			i18n.defaultLocale
		);

	return i18n.defaultLocale;
};

export const useTranslations = () => {
	const locale = useLocale();
	return translations[locale as keyof typeof translations];
};
