/** @type {import('next').NextConfig} */

const withSvgr = require("next-plugin-svgr");

module.exports = withSvgr({
    webpack(config, options) {
        return config;
    },
    images: {
        domains: [
            "lh3.googleusercontent.com",
            "avatars.githubusercontent.com",
            "github.com",
        ],
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
});
