/** @type {import('next').NextConfig} */

module.exports = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
        });

        config.resolve.alias = {
            ...config.resolve.alias,
            "react/jsx-runtime.js": "react/jsx-runtime",
            "react/jsx-dev-runtime.js": "react/jsx-dev-runtime"
        };

        return config;
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'github.com'],
    },
    i18n: {
        // These are all the locales you want to support in
        // your application
        locales: ['default', 'en', 'pt-BR'],
        // This is the default locale you want to be used when visiting
        // a non-locale prefixed path e.g. `/hello`
        defaultLocale: 'default',
    },
    trailingSlash: true
}
