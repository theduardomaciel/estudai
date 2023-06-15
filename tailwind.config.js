/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				"primary-01": "rgb(var(--color-primary-01) / <alpha-value>)",
				"primary-02": "rgb(var(--color-primary-02) / <alpha-value>)",
				"primary-03": "rgb(var(--color-primary-03) / <alpha-value>)",
				"primary-04": "rgb(var(--color-primary-04) / <alpha-value>)",

				"background-01":
					"rgb(var(--color-background-01) / <alpha-value>)",
				"background-02":
					"rgb(var(--color-background-02) / <alpha-value>)",
				"background-03":
					"rgb(var(--color-background-03) / <alpha-value>)",
				"background-04":
					"rgb(var(--color-background-04) / <alpha-value>)",

				"font-light": "rgb(var(--color-font-light) / <alpha-value>)",
				"font-dark": "rgb(var(--color-font-dark) / <alpha-value>)",
				"font-dark-02":
					"rgb(var(--color-font-dark-02) / <alpha-value>)",
				"light-gray": "rgb(var(--color-light-gray) / <alpha-value>)",

				neutral: "rgb(var(--color-color-neutral) / <alpha-value>)",

				"red-01": "rgb(var(--color-red-01) / <alpha-value>)",
				"red-02": "rgb(var(--color-red-02) / <alpha-value>)",

				"green-01": "rgb(var(--color-green-01) / <alpha-value>)",
				"yellow-01": "rgb(var(--color-yellow-01) / <alpha-value>)",
			},
			fontFamily: {
				sans: ["var(--font-inter)"],
				raleway: ["var(--font-raleway)"],
				karla: ["var(--font-karla)"],
				serif: ["var(--font-trirong)"],
			},
		},
	},
	plugins: [],
};
