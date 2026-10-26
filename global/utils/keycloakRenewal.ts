/** The Keycloak account NextAuth keeps on the session token. `expires_at` is in seconds since the epoch. */
export type KeycloakAccount = {
	access_token: string;
	expires_at?: number;
	id_token?: string;
	refresh_token: string;
	[field: string]: unknown;
};

/** The fields Stage uses from Keycloak's token endpoint response. */
export type KeycloakTokenResponse = {
	access_token: string;
	expires_in: number;
	id_token?: string;
	refresh_token?: string;
};

/**
 * Keycloak's answer to a refresh request: new tokens; a refusal, meaning the refresh token is no longer valid;
 * or unavailability, meaning Keycloak could not give an answer at all.
 */
export type TokenRequestResult =
	| { ok: true; tokens: KeycloakTokenResponse }
	| { ok: false; outcome: 'refused' | 'unavailable'; reason: string };

/**
 * The outcome of renewing an account. Only `refused` says the session is over; `unavailable` says nothing about
 * the session, so it is kept and renewal is tried again on a later read.
 */
export type RenewalResult =
	| { account: KeycloakAccount; status: 'renewed' }
	| { reason: string; status: 'refused' }
	| { reason: string; status: 'unavailable' };

/** How long before the access token expires Stage renews it. */
export const RENEWAL_MARGIN_SECONDS = 60;

/**
 * Whether the access token should be renewed now: within the margin of expiring, already expired,
 * or with no known expiry.
 */
export const isRenewalDue = (
	expiresAt: number | undefined,
	nowSeconds: number,
	marginSeconds: number = RENEWAL_MARGIN_SECONDS,
): boolean => (typeof expiresAt === 'number' ? nowSeconds >= expiresAt - marginSeconds : true);

/**
 * Applies Keycloak's token response to an account. Keycloak returns `expires_in`, not `expires_at`,
 * so the expiry is counted from `nowSeconds`; a token Keycloak did not return is kept.
 */
export const applyTokenResponse = (
	account: KeycloakAccount,
	tokens: KeycloakTokenResponse,
	nowSeconds: number,
): KeycloakAccount => ({
	...account,
	access_token: tokens.access_token,
	expires_at: nowSeconds + tokens.expires_in,
	id_token: tokens.id_token ?? account.id_token,
	refresh_token: tokens.refresh_token ?? account.refresh_token,
});

type RenewalEntry = { promise: Promise<RenewalResult>; settledAtMs?: number };

/**
 * Creates a renewer that makes one Keycloak request per refresh token. Concurrent callers share the
 * request in flight. A renewal or a refusal is remembered for `rememberForMs` after it settles, so a request
 * still carrying a refresh token Keycloak has since rotated out gets the renewed account instead of
 * presenting the old token again, which ends the client's Keycloak session when rotation is on.
 * Unavailability is not remembered, so the next renewal asks Keycloak again. The memory is per process.
 */
export const createRenewer = ({
	nowMs,
	rememberForMs,
	requestTokens,
}: {
	nowMs: () => number;
	rememberForMs: number;
	requestTokens: (refreshToken: string) => Promise<TokenRequestResult>;
}): ((account: KeycloakAccount) => Promise<RenewalResult>) => {
	const renewals = new Map<string, RenewalEntry>();

	const isRemembered = (entry: RenewalEntry, now: number): boolean =>
		entry.settledAtMs === undefined || now - entry.settledAtMs <= rememberForMs;

	const forgetExpired = (now: number): void => {
		renewals.forEach((entry, refreshToken) => {
			if (!isRemembered(entry, now)) {
				renewals.delete(refreshToken);
			}
		});
	};

	const toRenewalResult = (account: KeycloakAccount, result: TokenRequestResult): RenewalResult =>
		result.ok
			? { account: applyTokenResponse(account, result.tokens, Math.floor(nowMs() / 1000)), status: 'renewed' }
			: { reason: result.reason, status: result.outcome };

	const startRenewal = (account: KeycloakAccount): RenewalEntry => {
		const entry: RenewalEntry = {
			promise: requestTokens(account.refresh_token)
				.then((result) => toRenewalResult(account, result))
				.catch((): RenewalResult => ({ reason: 'request_failed', status: 'unavailable' }))
				.then((result) => {
					if (result.status === 'unavailable') {
						renewals.delete(account.refresh_token);
					} else {
						entry.settledAtMs = nowMs();
					}
					return result;
				}),
		};
		return entry;
	};

	return (account) => {
		forgetExpired(nowMs());
		const existing = renewals.get(account.refresh_token);
		if (existing) {
			return existing.promise;
		}
		const entry = startRenewal(account);
		renewals.set(account.refresh_token, entry);
		return entry.promise;
	};
};
