import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import NextAuth, { SessionStrategy } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";
import { OAuthConfig } from 'next-auth/providers'
import urlJoin from 'url-join';

import axios from 'axios';

import { getConfig } from '@/global/config';
import { KEYCLOAK_URL_TOKEN, KEYCLOAK_URL_ISSUER, AUTH_PROVIDER } from '@/global/utils/constants';
import { decodeToken, extractUser } from '@/global/utils/egoTokenUtils';


const { NEXT_PUBLIC_KEYCLOAK_CLIENT_ID, 
  NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET, 
  NEXT_PUBLIC_KEYCLOAK_SECRET,
  NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE,
  NEXT_PUBLIC_EGO_API_ROOT,
  NEXT_PUBLIC_EGO_CLIENT_ID
} = getConfig();

const bodyParams = () => {
  return new URLSearchParams({
    'grant_type': 'urn:ietf:params:oauth:grant-type:uma-ticket',
    'audience': NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE,
    'response_mode': 'permissions'
  });
}

const headerWithBearer = (accessToken: string) => {
  return {
    'content-type': 'application/x-www-form-urlencoded',
    'authorization': 'Bearer ' + accessToken,
    'accept': '*/*'
  }
}

const fetchPermissions = async (accessToken: string) => {
  const { data } = await axios.post(
    KEYCLOAK_URL_TOKEN, 
    bodyParams(),
  {
    headers: headerWithBearer(accessToken)
  });
  return data;
}

type Permission = {
  rsid: string;
  rsname: string;
  scopes: string[];
};

const scopesFromPermissions = (permissions: Permission[]) => {
  return permissions
    .filter(p => p.scopes)
    .flatMap(p => p.scopes.flatMap(s => [p.rsname + "." + s]))

}

const egoLoginUrl = urlJoin(
  NEXT_PUBLIC_EGO_API_ROOT,
  `/oauth/ego-token?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`,
);

const fetchEgoToken = async (login_nonce: string) => {
  const { data } = await axios.post(
    egoLoginUrl, 
    bodyParams(),
  {
    headers: { 'Accept': '*/*', 'Cookie': `LOGIN_NONCE=${login_nonce}`},
  });

  return data;
}

export const getAuthOptions = (req: GetServerSidePropsContext["req"] | NextApiRequest) => {
  return {
    secret: NEXT_PUBLIC_KEYCLOAK_SECRET,
    // Configure one or more authentication providers
    providers: [
      KeycloakProvider({
        clientId: NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
        clientSecret: NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET,
        issuer: KEYCLOAK_URL_ISSUER,
      }),
      {
        id: AUTH_PROVIDER.EGO,
        name: AUTH_PROVIDER.EGO,
        type: "oauth",
        authorization: {
            url: ""
        },
        token: {
          url: undefined,
        },
        userinfo: {
          url: undefined,
          async request() {
            return {
              login_nonce: req.cookies["LOGIN_NONCE"]
            }
          }
        },
        async profile({login_nonce}: any) {

            const egoToken = (login_nonce) ? await fetchEgoToken(login_nonce) : null;

            const userInfo = egoToken ? decodeToken(egoToken) : null;
            if(userInfo) {
              const user = extractUser(userInfo);

              return {
                egoToken: egoToken,
                ...user
              };
            }
            return null;
        },
        checks: ["none"],
        clientId: NEXT_PUBLIC_EGO_CLIENT_ID,
      } as OAuthConfig<any>
    ],
    callbacks: {
        async jwt({ token, user, account, profile, trigger }: any) {

            if(trigger === "signIn"){
              if(account?.provider == AUTH_PROVIDER.EGO){
                token.account = account
                token.profile = user
              } else if(account?.provider == AUTH_PROVIDER.KEYCLOAK){
                token.account = account
                token.profile = profile
      
                const permissions = await fetchPermissions(token.account.access_token);
                token.permissions = permissions
              }
            }
  
            return token
        },
        async session({ token, session }: any) {
            // Send properties to the client, like an access_token and user id from a provider.
            if(token.account.provider == AUTH_PROVIDER.EGO){
              const { egoToken, scope, ...profileWithoutEgoToken } = token.profile;
              session.account = {
                accessToken: egoToken,
                provider: token?.account?.provider
              }
              session.scopes = scope
              session.user = {...profileWithoutEgoToken}
            } else if(token.account.provider == AUTH_PROVIDER.KEYCLOAK) {
              session.account = {
                accessToken: token?.account?.access_token,
                provider: token?.account?.provider
              }
              session.user.firstName = token?.profile?.given_name
              session.user.lastName = token?.profile?.family_name
              session.user.emailVerified = token?.profile?.email_verified
              session.user.id = token?.sub
              if(!session.user.email) session.user.email = token?.profile?.email
              session.scopes = scopesFromPermissions(token?.permissions);
            }
  
            return session
        }
    },
    session: {
        // Encrypted JWT (JWE) stored in the session cookie.
        strategy: "jwt" as SessionStrategy,
        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 60 * 60, // 1 hour
        raw: true
    },
    debug: false
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, getAuthOptions(req))
}