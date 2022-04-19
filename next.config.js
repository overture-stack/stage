const path = require('path');
const withPlugins = require('next-compose-plugins');
const { patchWebpackConfig: patchForGlobalCSS } = require('next-global-css');
const withTranspileModules = require('next-transpile-modules')([
  '@overture-stack/arranger-components',
]);

module.exports = withPlugins([withTranspileModules], {
  webpack: (config, options) => {
    // These 'react' related configs are added to enable linking packages in development
    // (e.g. Arranger), and not get the "broken Hooks" warning.
    // https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react
    if (options.isServer) {
      config.externals = ['react', ...config.externals];
    }

    config.resolve.alias['react'] = path.resolve(__dirname, '.', 'node_modules', 'react');
    config.resolve.alias['@emotion/react'] = path.resolve(
      __dirname,
      '.',
      'node_modules',
      '@emotion/react',
    );

    return patchForGlobalCSS(config, options);
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_UI_VERSION: process.env.npm_package_version,
    NEXT_PUBLIC_EGO_API_ROOT: process.env.NEXT_PUBLIC_EGO_API_ROOT,
    NEXT_PUBLIC_EGO_CLIENT_ID: process.env.NEXT_PUBLIC_EGO_CLIENT_ID,
    EGO_PUBLIC_KEY: process.env.EGO_PUBLIC_KEY,
    NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE: process.env.NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE,
    NEXT_PUBLIC_ARRANGER_INDEX: process.env.NEXT_PUBLIC_ARRANGER_INDEX,
    NEXT_PUBLIC_ARRANGER_API: process.env.NEXT_PUBLIC_ARRANGER_API_URL,
    NEXT_PUBLIC_ARRANGER_ADMIN_UI: process.env.NEXT_PUBLIC_ARRANGER_ADMIN_UI_URL,
    NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS: process.env.NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS,
    // using ASSET_PREFIX for the public runtime BASE_PATH because basePath in the top level config was not working
    // with the dms reverse proxy setup
    NEXT_PUBLIC_BASE_PATH: process.env.ASSET_PREFIX,
    NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    NEXT_PUBLIC_LAB_NAME: process.env.NEXT_PUBLIC_LAB_NAME,
    NEXT_PUBLIC_LOGO_FILENAME: process.env.NEXT_PUBLIC_LOGO_FILENAME,
    NEXT_PUBLIC_SSO_PROVIDERS: process.env.NEXT_PUBLIC_SSO_PROVIDERS,
  },
  assetPrefix: process.env.ASSET_PREFIX || '',
  optimizeFonts: false,
  experimental: {
    esmExternals: 'loose',
  },
});
