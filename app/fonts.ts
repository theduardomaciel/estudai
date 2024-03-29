// Fonts
import { Inter, Raleway, Karla, Trirong } from "next/font/google";

export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const raleway = Raleway({
	weight: ["700", "800"],
	subsets: ["latin"],
	variable: "--font-raleway",
	display: "swap",
});

export const karla = Karla({
	weight: ["500", "700", "800"],
	subsets: ["latin"],
	variable: "--font-karla",
	display: "swap",
});

export const trirong = Trirong({
	weight: ["900"],
	subsets: ["latin"],
	variable: "--font-trirong",
	display: "swap",
});
