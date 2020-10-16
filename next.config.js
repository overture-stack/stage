const withCSS = require('@zeit/next-css');

if (process.env.DEBUG) {
  console.log('EGO_API_ROOT: ', process.env.NEXT_PUBLIC_EGO_API_ROOT);
  console.log('EGO_CLIENT_ID: ', process.env.NEXT_PUBLIC_EGO_CLIENT_ID);
  console.log('ARRANGER_PROJECT_ID: ', process.env.NEXT_PUBLIC_ARRANGER_PROJECT_ID);
  console.log('ARRANGER_GRAPHQL_FIELD: ', process.env.NEXT_PUBLIC_ARRANGER_GRAPHQL_FIELD);
  console.log('ARRANGER_INDEX: ', process.env.NEXT_PUBLIC_ARRANGER_INDEX);
  console.log('ARRANGER_API: ', process.env.NEXT_PUBLIC_ARRANGER_API_URL);
}

module.exports = withCSS({
  publicRuntimeConfig: {
    EGO_API_ROOT: process.env.NEXT_PUBLIC_EGO_API_ROOT,
    EGO_CLIENT_ID: process.env.NEXT_PUBLIC_EGO_CLIENT_ID,
    EGO_PUBLIC_KEY: process.env.EGO_PUBLIC_KEY,
    ARRANGER_PROJECT_ID: process.env.NEXT_PUBLIC_ARRANGER_PROJECT_ID,
    ARRANGER_GRAPHQL_FIELD: process.env.NEXT_PUBLIC_ARRANGER_GRAPHQL_FIELD,
    ARRANGER_INDEX: process.env.NEXT_PUBLIC_ARRANGER_INDEX,
    ARRANGER_API: process.env.NEXT_PUBLIC_ARRANGER_API_URL,
  },
});
