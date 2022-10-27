/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([/* 'react-dnd' */]) // or whatever library giving trouble

module.exports = withTM({
    reactStrictMode: true,
    swcMinify: true,

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
        domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    },
})
