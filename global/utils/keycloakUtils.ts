import { getConfig } from '@/global/config';
import urlJoin from 'url-join';

import { TokenRequestResult } from './keycloakRenewal';

export const permissionBodyParams = () => {
	const { NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE } = getConfig();
	return new URLSearchParams({
		grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
		audience: NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE,
		response_mode: 'permissions',
	});
};

export type Permission = {
	rsid: string;
	rsname: string;
	scopes: string[];
};

export const scopesFromPermissions = (permissions: Permission[]) => {
	return permissions
		.filter(({ scopes }) => scopes)
		.flatMap(({ rsname, scopes }) => scopes.flatMap((scope) => [rsname + '.' + scope]));
};

const openIdConnectEndpoint = (endpoint: 'logout' | 'token'): string => {
	const { NEXT_PUBLIC_KEYCLOAK_HOST, NEXT_PUBLIC_KEYCLOAK_REALM } = getConfig();
	return urlJoin(NEXT_PUBLIC_KEYCLOAK_HOST, 'realms', NEXT_PUBLIC_KEYCLOAK_REALM, 'protocol/openid-connect', endpoint);
};

const clientCredentials = (): Record<string, string> => {
	const { KEYCLOAK_CLIENT_SECRET, NEXT_PUBLIC_KEYCLOAK_CLIENT_ID } = getConfig();
	return { client_id: NEXT_PUBLIC_KEYCLOAK_CLIENT_ID, client_secret: KEYCLOAK_CLIENT_SECRET };
};

// Renewals of one session share a request in flight, so a request Keycloak never answers would hold them all.
const KEYCLOAK_REQUEST_TIMEOUT_MS = 10_000;

const postForm = (url: string, fields: Record<string, string>): Promise<Response> =>
	fetch(url, {
		body: new URLSearchParams(fields),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
		method: 'POST',
		signal: AbortSignal.timeout(KEYCLOAK_REQUEST_TIMEOUT_MS),
	});

const failureReason = async (response: Response): Promise<string> => {
	const body = await response.json().catch(() => ({}));
	return typeof body?.error === 'string' ? body.error : `http_${response.status}`;
};

/**
 * Exchanges a refresh token for new tokens at Keycloak's token endpoint, as Stage's confidential client.
 * Only `invalid_grant` is a refusal, meaning the refresh token is no longer good. Every other failed answer,
 * including a rejection of Stage's own client credentials, means Keycloak is unavailable to this session.
 * Rejects when Keycloak cannot be reached or does not answer in time.
 */
export const requestKeycloakTokens = async (refreshToken: string): Promise<TokenRequestResult> => {
	const response = await postForm(openIdConnectEndpoint('token'), {
		...clientCredentials(),
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
	});
	if (response.ok) {
		return { ok: true, tokens: await response.json() };
	}
	const reason = await failureReason(response);
	return { ok: false, outcome: reason === 'invalid_grant' ? 'refused' : 'unavailable', reason };
};

/**
 * Ends the user's Keycloak session from Stage's server, using the session's refresh token and the client's
 * credentials, so the browser never handles a token to sign out.
 */
export const endKeycloakSession = async (
	refreshToken: string,
): Promise<{ ok: true } | { ok: false; reason: string }> => {
	const response = await postForm(openIdConnectEndpoint('logout'), {
		...clientCredentials(),
		refresh_token: refreshToken,
	});
	return response.ok ? { ok: true } : { ok: false, reason: await failureReason(response) };
};
