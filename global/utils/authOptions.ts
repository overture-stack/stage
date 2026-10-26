import axios from 'axios';
import { AuthOptions } from 'next-auth';
import { OAuthConfig } from 'next-auth/providers';
import KeycloakProvider from 'next-auth/providers/keycloak';
import urlJoin from 'url-join';

import { getConfig } from '@/global/config';
import { AUTH_PROVIDER, KEYCLOAK_URL_ISSUER, SESSION_ENDED } from '@/global/utils/constants';
import { encryptContent } from '@/global/utils/crypt';
import { decodeToken, extractUser } from '@/global/utils/egoTokenUtils';

import { createRenewer, isRenewalDue, KeycloakAccount, RENEWAL_MARGIN_SECONDS } from './keycloakRenewal';
import { endKeycloakSession, requestKeycloakTokens } from './keycloakUtils';

const renewKeycloakAccount = createRenewer({
	nowMs: Date.now,
	rememberForMs: RENEWAL_MARGIN_SECONDS * 1000,
	requestTokens: requestKeycloakTokens,
});

/**
 * What server code handling a request may use from its Keycloak session: a current access token, or the fact
 * that the token has expired while Keycloak was unavailable to renew it.
 */
export type RequestKeycloakAuth = { accessToken: string; status: 'current' } | { status: 'unavailable' };

const requestKeycloakAuth = new WeakMap<object, RequestKeycloakAuth>();

/**
 * The Keycloak access of the session read while handling `req`, renewed first if renewal was due. Absent when
 * that session holds no Keycloak access. Held server-side for the request only, so the token never needs to be
 * in the session sent to the browser.
 */
export const getRequestKeycloakAuth = (req: object): RequestKeycloakAuth | undefined => requestKeycloakAuth.get(req);

const recordAccessToken = (req: object, accessToken: string): void => {
	requestKeycloakAuth.set(req, { accessToken, status: 'current' });
};

const FORCED_RENEWAL_INTERVAL_MS = 60_000;

const forcedRenewalRequests = new WeakSet<object>();

const lastForcedRenewalMs = new Map<string, number>();

/**
 * Marks `req` so the next read of its Keycloak session renews at once, whatever the access token's expiry. Used
 * when an upstream has rejected the access token: Keycloak's answer to the renewal then decides whether the
 * session goes on. At most one forced renewal per person per minute.
 */
export const requestForcedRenewal = (req: object): void => {
	forcedRenewalRequests.add(req);
};

const forgetOldForcedRenewals = (nowMs: number): void => {
	lastForcedRenewalMs.forEach((atMs, subject) => {
		if (nowMs - atMs >= FORCED_RENEWAL_INTERVAL_MS) {
			lastForcedRenewalMs.delete(subject);
		}
	});
};

const takeForcedRenewal = (req: object, subject: string | undefined, nowMs: number): boolean => {
	forgetOldForcedRenewals(nowMs);
	const isAllowed = forcedRenewalRequests.has(req) && subject !== undefined && !lastForcedRenewalMs.has(subject);
	if (isAllowed) {
		lastForcedRenewalMs.set(subject, nowMs);
	}
	return isAllowed;
};

const logAuthEvent = (fields: { event: string; outcome: string; reason: string; subject?: string }): void => {
	console.error(JSON.stringify({ ...fields, timestamp: new Date().toISOString() }));
};

const fetchEgoToken = async (egoLoginUrl: string, loginNonce: string) => {
	const { data } = await axios.post(egoLoginUrl, null, {
		headers: { Accept: '*/*', Cookie: `LOGIN_NONCE=${loginNonce}` },
	});

	return data;
};

const endedSessionToken = (token: any) => ({
	...token,
	account: { provider: token.account.provider },
	error: SESSION_ENDED,
});

const keepSessionWhileUnavailable = (token: any, req: object, reason: string) => {
	logAuthEvent({ event: 'auth.keycloak.renewal_unavailable', outcome: 'failure', reason, subject: token.sub });
	const account: KeycloakAccount = token.account;
	const isAccessTokenValid = typeof account.expires_at === 'number' && Date.now() / 1000 < account.expires_at;
	if (isAccessTokenValid) {
		recordAccessToken(req, account.access_token);
	} else {
		requestKeycloakAuth.set(req, { status: 'unavailable' });
	}
	return token;
};

const renewSessionToken = async (token: any, req: object) => {
	const result = await renewKeycloakAccount(token.account);
	if (result.status === 'renewed') {
		recordAccessToken(req, result.account.access_token);
		return { ...token, account: result.account };
	}
	if (result.status === 'unavailable') {
		return keepSessionWhileUnavailable(token, req, result.reason);
	}

	logAuthEvent({ event: 'auth.keycloak.renewal_refused', outcome: 'failure', reason: result.reason, subject: token.sub });
	return endedSessionToken(token);
};

const keepKeycloakSessionCurrent = async (token: any, req: object) => {
	if (token.error === SESSION_ENDED) {
		return token;
	}

	const account: KeycloakAccount = token.account;
	if (isRenewalDue(account.expires_at, Math.floor(Date.now() / 1000)) || takeForcedRenewal(req, token.sub, Date.now())) {
		return renewSessionToken(token, req);
	}

	recordAccessToken(req, account.access_token);
	return token;
};

const endKeycloakSessionForSignOut = async (token: any): Promise<void> => {
	const result = await endKeycloakSession(token.account.refresh_token).catch(() => ({
		ok: false as const,
		reason: 'request_failed',
	}));
	if (result.ok) {
		return;
	}

	logAuthEvent({ event: 'auth.keycloak.logout_failed', outcome: 'failure', reason: result.reason, subject: token.sub });
};

/**
 * NextAuth options for one request. `req` keys the request's Keycloak access, so server code handling
 * the same request can read it with `getRequestKeycloakAuth`.
 */
export const getAuthOptions = (req: { cookies: Partial<Record<string, string>> }): AuthOptions => {
	const {
		KEYCLOAK_CLIENT_SECRET,
		NEXT_PUBLIC_EGO_API_ROOT,
		NEXT_PUBLIC_EGO_CLIENT_ID,
		NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
		SESSION_ENCRYPTION_SECRET,
		SESSION_IDLE_TIMEOUT_SECONDS,
	} = getConfig();
	const egoLoginUrl = urlJoin(NEXT_PUBLIC_EGO_API_ROOT, `/oauth/ego-token?client_id=${NEXT_PUBLIC_EGO_CLIENT_ID}`);

	return {
		secret: SESSION_ENCRYPTION_SECRET,
		providers: [
			KeycloakProvider({
				clientId: NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
				clientSecret: KEYCLOAK_CLIENT_SECRET,
				issuer: KEYCLOAK_URL_ISSUER,
			}),
			{
				id: AUTH_PROVIDER.EGO,
				name: AUTH_PROVIDER.EGO,
				type: 'oauth',
				authorization: {
					url: '',
				},
				token: {
					url: undefined,
				},
				userinfo: {
					url: undefined,
					async request() {
						return {
							login_nonce: req.cookies['LOGIN_NONCE'],
						};
					},
				},
				async profile({ login_nonce }: any) {
					const egoToken = login_nonce ? await fetchEgoToken(egoLoginUrl, login_nonce) : null;

					const userInfo = egoToken ? decodeToken(egoToken) : null;
					if (userInfo) {
						const user = extractUser(userInfo);

						return {
							egoToken: egoToken,
							...user,
						};
					}
					return null;
				},
				checks: ['none'],
				clientId: NEXT_PUBLIC_EGO_CLIENT_ID,
			} as OAuthConfig<any>,
		],
		pages: {
			signIn: '/login',
		},
		callbacks: {
			async jwt({ account, profile, token, trigger, user }: any) {
				if (trigger === 'signIn' && account?.provider === AUTH_PROVIDER.EGO) {
					return { ...token, account, profile: user };
				}
				if (trigger === 'signIn' && account?.provider === AUTH_PROVIDER.KEYCLOAK) {
					recordAccessToken(req, account.access_token);
					return { ...token, account, profile };
				}
				if (token.account?.provider === AUTH_PROVIDER.KEYCLOAK) {
					return keepKeycloakSessionCurrent(token, req);
				}

				return token;
			},
			async session({ session, token }: any) {
				const provider = token.account?.provider;
				if (provider === AUTH_PROVIDER.EGO) {
					const { egoToken, scope, ...profileWithoutEgoToken } = token.profile;
					session.account = {
						accessToken: encryptContent(egoToken),
						provider: token?.account?.provider,
					};
					session.scopes = scope;
					session.user = { ...profileWithoutEgoToken };
				}
				if (provider === AUTH_PROVIDER.KEYCLOAK) {
					// The browser receives the user's identity only; tokens stay on the server-side session token.
					return {
						...session,
						account: { provider },
						...(token.error === SESSION_ENDED ? { error: SESSION_ENDED } : {}),
						user: {
							...session.user,
							email: session.user?.email || token.profile?.email,
							emailVerified: token.profile?.email_verified,
							firstName: token.profile?.given_name,
							id: token.sub,
							lastName: token.profile?.family_name,
						},
					};
				}

				return session;
			},
		},
		events: {
			async signOut({ token }: any) {
				if (token?.account?.provider === AUTH_PROVIDER.KEYCLOAK && token.account.refresh_token) {
					await endKeycloakSessionForSignOut(token);
				}
			},
		},
		session: {
			// NextAuth extends the session on every read, so this acts as an idle limit. The absolute limit is
			// Keycloak's, enforced when it refuses a renewal.
			maxAge: SESSION_IDLE_TIMEOUT_SECONDS,
			strategy: 'jwt',
		},
		debug: false,
	};
};
