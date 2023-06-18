import React from "react";
import { notFound } from "next/navigation";

// Stylesheets
import "app/global.css";
import { Providers } from "../providers";

// Fonts - Inter is the base font and Karla is used for the majority of buttons
import { inter, raleway, karla, trirong } from "app/fonts";

// Localization
import { Locale, i18n } from "@/i18n/config";

// Gambiarra/Workaround to force dynamic consumption of cookies() and headers() while we can't support SSG
export const dynamic = "force-dynamic";

export default function BaseLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	if (!i18n.locales.includes(params.locale as Locale)) {
		notFound();
	}

	return (
		<html
			lang={params.locale}
			className={`${inter.variable} ${raleway.variable} ${karla.variable} ${trirong.variable}`}
		>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
