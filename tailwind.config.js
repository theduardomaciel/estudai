/** @type {import('tailwindcss').Config} */

const baseFontSize = 10;

const convert = (value) => {
    return (16 * value) / baseFontSize + "rem";
};

module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
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

                neutral: "rgb(var(--color-neutral) / <alpha-value>)",

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
            spacing: () => ({
                ...Array.from({ length: 96 }, (_, index) => index * 0.5)
                    .filter((i) => i)
                    .reduce(
                        (acc, i) => ({
                            ...acc,
                            [i]: `${i / (baseFontSize / 4)}rem`,
                        }),
                        {}
                    ),
            }),
            fontSize: {
                xs: [
                    `${convert(0.75)}` /* 12px */,
                    {
                        lineHeight: `${convert(1)}` /* 16px */,
                    },
                ],
                sm: [
                    `${convert(0.875)}` /* 14px */,
                    {
                        lineHeight: `${convert(1.25)}` /* 20px */,
                    },
                ],
                base: [
                    `${convert(1)}` /* 16px */,
                    {
                        lineHeight: `${convert(1.5)}` /* 24px */,
                    },
                ],
                lg: [
                    `${convert(1.125)}` /* 18px */,
                    {
                        lineHeight: `${convert(1.75)}` /* 28px */,
                    },
                ],
                xl: [
                    `${convert(1.25)}` /* 20px */,
                    {
                        lineHeight: `${convert(1.75)}` /* 28px */,
                    },
                ],
                "2xl": [
                    `${convert(1.5)}` /* 24px */,
                    {
                        lineHeight: `${convert(2)}` /* 32px */,
                    },
                ],
                "3xl": [
                    `${convert(1.875)}` /* 30px */,
                    {
                        lineHeight: `${convert(2.25)}` /* 36px */,
                    },
                ],
                "4xl": [
                    `${convert(2.25)}` /* 36px */,
                    {
                        lineHeight: `${convert(2.5)}` /* 40px */,
                    },
                ],
                "5xl": [
                    `${convert(3)}` /* 48px */,
                    {
                        lineHeight: `${convert(1)}`,
                    },
                ],
                "6xl": [
                    `${convert(3.75)}` /* 60px */,
                    {
                        lineHeight: `${convert(1)}`,
                    },
                ],
                "7xl": [
                    `${convert(4.5)}` /* 72px */,
                    {
                        lineHeight: `${convert(1)}`,
                    },
                ],
                "8xl": [
                    `${convert(6)}` /* 96px */,
                    {
                        lineHeight: `${convert(1)}`,
                    },
                ],
                "9xl": [
                    `${convert(8)}` /* 128px */,
                    {
                        lineHeight: `${convert(1)}`,
                    },
                ],
            },
            lineHeight: {
                3: `${convert(0.75)}` /* 12px */,
                4: `${convert(1)}` /* 16px */,
                5: `${convert(1.25)}` /* 20px */,
                6: `${convert(1.5)}` /* 24px */,
                7: `${convert(1.75)}` /* 28px */,
                8: `${convert(2)}` /* 32px */,
                9: `${convert(2.25)}` /* 36px */,
                10: `${convert(2.5)}` /* 40px */,
            },
            borderRadius: {
                sm: `${convert(0.125)}` /* 2px */,
                DEFAULT: `${convert(0.25)}` /* 4px */,
                base: `${convert(0.3125)}` /* 5px */,
                md: `${convert(0.375)}` /* 6px */,
                lg: `${convert(0.5)}` /* 8px */,
                xl: `${convert(0.75)}` /* 12px */,
                "2xl": `${convert(1)}` /* 16px */,
                "3xl": `${convert(1.5)}` /* 24px */,
            },
            minWidth: (theme) => ({
                ...theme("spacing"),
            }),
            maxWidth: (theme) => ({
                ...theme("spacing"),
                0: "0rem",
                xs: `${convert(20)}` /* 320px */,
                sm: `${convert(24)}` /* 384px */,
                md: `${convert(28)}` /* 448px */,
                lg: `${convert(32)}` /* 512px */,
                xl: `${convert(36)}` /* 576px */,
                "2xl": `${convert(42)}` /* 672px */,
                "3xl": `${convert(48)}` /* 768px */,
                "4xl": `${convert(56)}` /* 896px */,
                "5xl": `${convert(64)}` /* 1024px */,
                "6xl": `${convert(72)}` /* 1152px */,
                "7xl": `${convert(80)}` /* 1280px */,
            }),
            typography: {
                DEFAULT: {
                    css: {
                        color: "var(--font-dark-02)",
                        a: {
                            color: "var(--primary-02)",
                            "&:hover": {
                                color: "var(--primary-03)",
                            },
                        },
                        h1: {
                            color: "var(--font-dark-02)",
                        },
                        h2: {
                            color: "var(--font-dark-02)",
                        },
                        h3: {
                            color: "var(--font-dark-02)",
                        },
                        h4: {
                            color: "var(--font-dark-02)",
                        },
                        h5: {
                            color: "var(--font-dark-02)",
                        },
                        h6: {
                            color: "var(--font-dark-02)",
                        },
                        ol: {
                            marginTop: "0.85rem",
                            marginBottom: "0.85rem",
                        },
                        ul: {
                            marginTop: "0.85rem",
                            marginBottom: "0.85rem",
                        },
                    },
                },
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
