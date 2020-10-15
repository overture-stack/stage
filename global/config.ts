import getNextConfig from 'next/config';

export const getConfig = () => {
  const publicConfig: { [k: string]: string } = getNextConfig()?.publicRuntimeConfig || {};

  return {
    EGO_API_ROOT: publicConfig.EGO_API_ROOT || 'http://localhost:8088',
    EGO_CLIENT_ID: publicConfig.EGO_CLIENT_ID || '',
    EGO_PUBLIC_KEY:
      publicConfig.EGO_PUBLIC_KEY ||
      `-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0lOqMuPLCVusc6szklNXQL1FHhSkEgR7An+8BllBqTsRHM4bRYosseGFCbYPn8r8FsWuMDtxp0CwTyMQR2PCbJ740DdpbE1KC6jAfZxqcBete7gP0tooJtbvnA6X4vNpG4ukhtUoN9DzNOO0eqMU0Rgyy5HjERdYEWkwTNB30i9I+nHFOSj4MGLBSxNlnuo3keeomCRgtimCx+L/K3HNo0QHTG1J7RzLVAchfQT0lu3pUJ8kB+UM6/6NG+fVyysJyRZ9gadsr4gvHHckw8oUBp2tHvqBEkEdY+rt1Mf5jppt7JUV7HAPLB/qR5jhALY2FX/8MN+lPLmb/nLQQichVQIDAQAB\r\n-----END PUBLIC KEY-----`,
    EGO_GOOGLE_ID: publicConfig.EGO_GOOGLE_ID || 'google',
    EGO_LINKEDIN_ID: publicConfig.EGO_LINKEDIN_ID || 'linkedin',
    EGO_FACEBOOK_ID: publicConfig.EGO_FACEBOOK_ID || 'facebook',
    EGO_GITHUB_ID: publicConfig.EGO_GITHUB_ID || 'github',
    EGO_ORCID_ID: publicConfig.EGO_ORCID_ID || 'orcid',
    ARRANGER_PROJECT_ID: publicConfig.ARRANGER_PROJECT_ID || '',
    ARRANGER_GRAPHQL_FIELD: publicConfig.ARRANGER_GRAPHQL_FIELD || '',
    ARRANGER_INDEX: publicConfig.ARRANGER_INDEX || '',
    ARRANGER_API: publicConfig.ARRANGER_API || 'http://localhost:5050',
  } as {
    EGO_API_ROOT: string;
    EGO_CLIENT_ID: string;
    EGO_PUBLIC_KEY: string;
    EGO_GOOGLE_ID: string;
    EGO_LINKEDIN_ID: string;
    EGO_FACEBOOK_ID: string;
    EGO_GITHUB_ID: string;
    EGO_ORCID_ID: string;
    ARRANGER_PROJECT_ID: string;
    ARRANGER_GRAPHQL_FIELD: string;
    ARRANGER_INDEX: string;
    ARRANGER_API: string;
  };
};
