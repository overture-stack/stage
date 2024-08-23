// @ts-check

const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withPlugins = require('next-compose-plugins');
const { patchWebpackConfig: patchForGlobalCSS } = require('next-global-css');
const withTranspileModules = require('next-transpile-modules')([]);
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const jsdom = require('jsdom');

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withPlugins([withTranspileModules], {
	webpack: (config, options) => {
		if (options.isServer) {
			// Adaptors for Browser APIs used in iobio-charts web components
			const { JSDOM } = jsdom;
			const dom = new JSDOM('', { url: 'http://localhost/' });

			// @ts-ignore
			global.window = dom.window;

			global.customElements = global.window.customElements;
			global.HTMLElement = global.window.HTMLElement;
			global.document = global.window.document;
			global.Element = global.window.Element;
			global.localStorage = global.window.localStorage;
			global.navigator = global.window.navigator;

			// These 'react' related configs are added to enable linking packages in development
			// (e.g. Arranger), and not get the "broken Hooks" warning.
			// https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react
			config.externals = ['react', ...config.externals];
		} else {
			options.dev &&
				config.plugins.push(new ForkTsCheckerWebpackPlugin()) &&
				config.plugins.push(
					new ExtraWatchWebpackPlugin({
						dirs: [path.resolve(__dirname, '.', 'node_modules', 'react')],
					}),
				);
		}

		config.experiments = {
			...config.experiments,
			topLevelAwait: true,
		};
		config.resolve.alias['@emotion/react'] = path.resolve(
			__dirname,
			'.',
			'node_modules',
			'@emotion/react',
		);
		config.resolve.alias['react'] = path.resolve(__dirname, '.', 'node_modules', 'react');

		process.env.NODE_ENV === 'development' && (config.optimization.minimize = false);

		return patchForGlobalCSS(config, options);
	},
	publicRuntimeConfig: {
		EGO_PUBLIC_KEY: process.env.EGO_PUBLIC_KEY,
		NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
		NEXT_PUBLIC_ARRANGER_API: process.env.NEXT_PUBLIC_ARRANGER_API_URL,
		NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE: process.env.NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE,
		NEXT_PUBLIC_ARRANGER_INDEX: process.env.NEXT_PUBLIC_ARRANGER_INDEX,
		NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS: process.env.NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS,
		NEXT_PUBLIC_AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
		// using ASSET_PREFIX for the public runtime BASE_PATH because basePath in the top level config was not working
		// with the dms reverse proxy setup
		NEXT_PUBLIC_BASE_PATH: process.env.ASSET_PREFIX,
		NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,
		NEXT_PUBLIC_EGO_API_ROOT: process.env.NEXT_PUBLIC_EGO_API_ROOT,
		NEXT_PUBLIC_EGO_CLIENT_ID: process.env.NEXT_PUBLIC_EGO_CLIENT_ID,
		NEXT_PUBLIC_KEYCLOAK_HOST: process.env.NEXT_PUBLIC_KEYCLOAK_HOST,
		NEXT_PUBLIC_KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
		NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
		NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE: process.env.NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE,
		NEXT_PUBLIC_LAB_NAME: process.env.NEXT_PUBLIC_LAB_NAME,
		NEXT_PUBLIC_LOGO_FILENAME: process.env.NEXT_PUBLIC_LOGO_FILENAME,
		NEXT_PUBLIC_SSO_PROVIDERS: process.env.NEXT_PUBLIC_SSO_PROVIDERS,
		NEXT_PUBLIC_UI_VERSION: process.env.npm_package_version,
	},
	assetPrefix: process.env.ASSET_PREFIX || '',
	optimizeFonts: false,
	experimental: {
		esmExternals: 'loose',
	},
});
