import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";
import { COOKIE_LOCALE_NAME, Locale, i18n } from "./config";

export function getLocaleFromPathname(pathname: string) {
	return pathname.split("/")[1];
}

export function getHost(requestHeaders: Headers) {
	return (
		requestHeaders.get("x-forwarded-host") ??
		requestHeaders.get("host") ??
		undefined
	);
}

function getAcceptLanguageLocale(headers: Headers) {
	// Negotiator expects plain object so we need to transform headers
	const negotiatorHeaders: Record<string, string> = {};
	headers.forEach((value, key) => (negotiatorHeaders[key] = value));

	// Use negotiator and intl-localematcher to get best locale
	let languages = new Negotiator({ headers: negotiatorHeaders }).languages();
	// @ts-ignore locales are readonly
	const locales: string[] = i18n.locales;

	return matchLocale(languages, locales, i18n.defaultLocale);
}

export function resolveLocale(
	requestHeaders: Headers,
	requestCookies: RequestCookies,
	pathname: string
) {
	let locale;
	let incorrectLocaleInputToRemove;

	const locales = i18n.locales.map((locale) => locale.toLowerCase()); // used for comparisons
	const simplifiedLocales = locales.map((locale) => locale.split("-")[0]);

	// Locale revisions (in the case the correct locale was not found in the pathname)
	// Corrections:
	// 1. user writes the language with an unsupported locale (e.g. /en-US/), we remove the mistype to later redirect to the correct locale (e.g. /en/)
	// 2. user writes the language but not inserts locale (e.g. /pt/), we remove the mistype to later redirect to the correct locale (e.g. /pt-BR/)
	// 3. case sensitive cases are handled by the 'resolveLocale' function (e.g. /En/ -> /en/)

	// Prio 1: Use route prefix
	if (pathname) {
		const defaultPathLocale = getLocaleFromPathname(pathname); // used for responses
		const pathLocale = defaultPathLocale.toLowerCase(); // use for comparisons

		if (locales.includes(pathLocale as Locale)) {
			locale = i18n.locales[locales.indexOf(pathLocale as Locale)];
		} else if (locales.includes(pathLocale.split("-")[0] as Locale)) {
			locale =
				i18n.locales[
					locales.indexOf(pathLocale.split("-")[0] as Locale)
				];
			incorrectLocaleInputToRemove = defaultPathLocale;
		} else if (simplifiedLocales.includes(pathLocale)) {
			locale = i18n.locales[simplifiedLocales.indexOf(defaultPathLocale)];
			incorrectLocaleInputToRemove = defaultPathLocale;
		}
	}

	// Prio 2: Use existing cookie
	if (!locale && requestCookies) {
		if (requestCookies.has(COOKIE_LOCALE_NAME)) {
			const value = requestCookies.get(COOKIE_LOCALE_NAME)?.value;
			if (value && i18n.locales.includes(value as Locale)) {
				locale = value;
			}
		}
	}

	// Prio 3: Use the `accept-language` header
	if (!locale && requestHeaders) {
		locale = getAcceptLanguageLocale(requestHeaders);
	}

	// Prio 4: Use default locale
	if (!locale) {
		locale = i18n.defaultLocale;
	}

	return { locale, incorrectLocaleInputToRemove };
}
