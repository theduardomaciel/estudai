import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { COOKIE_LOCALE_NAME, i18n } from "./i18n/config";
import { resolveLocale } from "./i18n/resolveLocale";

const authenticatedPaths = ["home", "groups", "marketplace", "settings"];
const unauthenticatedPaths = ["", "login", "register"];

export function middleware(request: NextRequest) {
	let pathname = request.nextUrl.pathname;
	// console.log("Middleware: ", pathname, request.cookies.getAll());

	// // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
	// // If you have one
	// if (
	//   [
	//     '/manifest.json',
	//     '/favicon.ico',
	//     // Your other files in `public`
	//   ].includes(pathname)
	// )
	//   return

	// Check if there is any supported locale in the pathname
	const pathnameIsMissingValidLocale = i18n.locales.every(
		(locale) =>
			!pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
	);

	const { locale, incorrectLocaleInputToRemove } = resolveLocale(
		request.headers,
		request.cookies,
		pathname
	);
	const LOCALE_COOKIE = request.cookies.get(COOKIE_LOCALE_NAME);

	let response = NextResponse.next();

	// Locale handling
	if (pathnameIsMissingValidLocale) {
		if (
			incorrectLocaleInputToRemove &&
			pathname.includes(incorrectLocaleInputToRemove)
		) {
			console.log("Removendo input de linguagem incorreto");
			// Remove incorrect locale input from pathname
			pathname = pathname.replace(`/${incorrectLocaleInputToRemove}`, "");
		}
		// Redirect to the same url but with the correct locale
		response = NextResponse.redirect(
			new URL(
				`/${locale}${pathname}${request.nextUrl.search}`,
				request.url
			)
		);
	}

	// Authenticated routes handling
	const isAuthenticated = !!request.cookies.get("estudai.auth.token");

	const purePathname = pathnameIsMissingValidLocale
		? pathname.split("/")[1]
		: pathname.split("/")[2];

	if (isAuthenticated && unauthenticatedPaths.includes(purePathname)) {
		pathname = `/home`;
		console.log("Redirecionando para home");
		// Redirect to dashboard home if the user is authenticated
		response = NextResponse.redirect(
			new URL(`/${locale}/home${request.nextUrl.search}`, request.url)
		);
	} else if (!isAuthenticated && authenticatedPaths.includes(purePathname)) {
		pathname = `/login`;
		console.log("Redirecionando para login");
		// Redirect to login if the user is not authenticated
		response = NextResponse.redirect(
			new URL(`/${locale}/login${request.nextUrl.search}`, request.url)
		);
	}

	// Update cookie if the locale has changed
	if (!LOCALE_COOKIE || (!!LOCALE_COOKIE && LOCALE_COOKIE.value !== locale)) {
		response.cookies.set(COOKIE_LOCALE_NAME, locale, {
			sameSite: "strict",
			priority: "high",
			secure: true,
		});
		console.log("Cookie de linguagem atualizado.");
	}

	// We set the language header to the response so that the browser knows which language the page is in
	response.headers.set("User-Language", locale);
	// It's also possible to store the locale in a cookie, but they don't work in redirects from Google OAuth
	// due to our strategy (gambiarra) of checking if the cookie has changed to redirect to the same url
	// which is necessary to update the language of the page and causes a infinite loop since the cookie is never updated on redirect pages
	// and there's not such a way to know when to stop redirecting to the same url

	return response;
}

export const config = {
	// Matcher ignoring `/_next/` and `/api/`
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
