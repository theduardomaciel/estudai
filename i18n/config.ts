export const i18n = {
	locales: ["en", "pt-BR"],
	defaultLocale: "en",
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const COOKIE_LOCALE_NAME = "NEXT_LOCALE";
