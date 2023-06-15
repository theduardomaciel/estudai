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
});
