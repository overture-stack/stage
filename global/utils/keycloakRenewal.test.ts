import {
	applyTokenResponse,
	createRenewer,
	isRenewalDue,
	KeycloakAccount,
	TokenRequestResult,
} from './keycloakRenewal';

const account = (overrides: Partial<KeycloakAccount> = {}): KeycloakAccount => ({
	access_token: 'access-1',
	expires_at: 1_000,
	id_token: 'id-1',
	provider: 'keycloak',
	refresh_token: 'refresh-1',
	...overrides,
});

const granted = (overrides: Record<string, unknown> = {}): TokenRequestResult => ({
	ok: true,
	tokens: {
		access_token: 'access-2',
		expires_in: 300,
		id_token: 'id-2',
		refresh_token: 'refresh-2',
		...overrides,
	},
});

const deferred = <T>() => {
	const handlers: { resolve?: (value: T) => void } = {};
	const promise = new Promise<T>((resolve) => {
		handlers.resolve = resolve;
	});
	return { promise, resolve: (value: T) => handlers.resolve?.(value) };
};

describe('isRenewalDue', () => {
	it('is not due while the access token has more than the margin left', () => {
		expect(isRenewalDue(1_000, 900, 60)).toBe(false);
	});

	it('is due once the access token is within the margin of expiring', () => {
		expect(isRenewalDue(1_000, 941, 60)).toBe(true);
	});

	it('is due once the access token has expired', () => {
		expect(isRenewalDue(1_000, 1_500, 60)).toBe(true);
	});

	it('is due when the expiry is unknown', () => {
		expect(isRenewalDue(undefined, 900, 60)).toBe(true);
	});
});

describe('applyTokenResponse', () => {
	it('sets the expiry from expires_in, counted from the time of the response', () => {
		const renewed = applyTokenResponse(account(), { access_token: 'access-2', expires_in: 300 }, 5_000);

		expect(renewed.expires_at).toBe(5_300);
	});

	it('replaces the access and refresh tokens with the ones Keycloak returned', () => {
		const renewed = applyTokenResponse(
			account(),
			{ access_token: 'access-2', expires_in: 300, refresh_token: 'refresh-2' },
			5_000,
		);

		expect(renewed).toMatchObject({ access_token: 'access-2', refresh_token: 'refresh-2' });
	});

	it('keeps the ID token and refresh token it had when Keycloak returns none', () => {
		const renewed = applyTokenResponse(account(), { access_token: 'access-2', expires_in: 300 }, 5_000);

		expect(renewed).toMatchObject({ id_token: 'id-1', refresh_token: 'refresh-1' });
	});

	it('keeps the account fields that are not tokens', () => {
		const renewed = applyTokenResponse(
			account({ session_state: 'state-1' }),
			{ access_token: 'access-2', expires_in: 300 },
			5_000,
		);

		expect(renewed).toMatchObject({ provider: 'keycloak', session_state: 'state-1' });
	});
});

describe('createRenewer', () => {
	const clock = (startMs: number) => {
		const time = { ms: startMs };
		return { advance: (ms: number) => (time.ms += ms), nowMs: () => time.ms };
	};

	it('returns the renewed account when Keycloak grants new tokens', async () => {
		const { nowMs } = clock(10_000);
		const renew = createRenewer({ nowMs, rememberForMs: 60_000, requestTokens: async () => granted() });

		const result = await renew(account());

		expect(result).toEqual({
			account: expect.objectContaining({ access_token: 'access-2', expires_at: 310, refresh_token: 'refresh-2' }),
			status: 'renewed',
		});
	});

	it('reports a refusal when Keycloak refuses the refresh token', async () => {
		const { nowMs } = clock(10_000);
		const renew = createRenewer({
			nowMs,
			rememberForMs: 60_000,
			requestTokens: async () => ({ ok: false, outcome: 'refused', reason: 'invalid_grant' }),
		});

		expect(await renew(account())).toEqual({ reason: 'invalid_grant', status: 'refused' });
	});

	it('reports Keycloak as unavailable when it answers with a server error', async () => {
		const { nowMs } = clock(10_000);
		const renew = createRenewer({
			nowMs,
			rememberForMs: 60_000,
			requestTokens: async () => ({ ok: false, outcome: 'unavailable', reason: 'http_503' }),
		});

		expect(await renew(account())).toEqual({ reason: 'http_503', status: 'unavailable' });
	});

	it('reports Keycloak as unavailable when it cannot be reached or does not answer in time', async () => {
		const { nowMs } = clock(10_000);
		const renew = createRenewer({
			nowMs,
			rememberForMs: 60_000,
			requestTokens: async () => {
				throw new Error('The operation was aborted due to timeout');
			},
		});

		expect(await renew(account())).toEqual({ reason: 'request_failed', status: 'unavailable' });
	});

	it('makes one Keycloak request for concurrent renewals of the same refresh token, and shares its result', async () => {
		const { nowMs } = clock(10_000);
		const response = deferred<TokenRequestResult>();
		const requestTokens = jest.fn(() => response.promise);
		const renew = createRenewer({ nowMs, rememberForMs: 60_000, requestTokens });

		const first = renew(account());
		const second = renew(account());
		response.resolve(granted());

		expect(await first).toEqual(await second);
		expect(requestTokens).toHaveBeenCalledTimes(1);
	});

	it('gives a request arriving after the renewal finished the same result, without asking Keycloak again', async () => {
		const { advance, nowMs } = clock(10_000);
		const requestTokens = jest.fn(async () => granted());
		const renew = createRenewer({ nowMs, rememberForMs: 60_000, requestTokens });

		const first = await renew(account());
		advance(30_000);
		const late = await renew(account());

		expect(late).toEqual(first);
		expect(requestTokens).toHaveBeenCalledTimes(1);
	});

	it('asks Keycloak again once the remembered result is older than the memory period', async () => {
		const { advance, nowMs } = clock(10_000);
		const requestTokens = jest.fn(async () => granted());
		const renew = createRenewer({ nowMs, rememberForMs: 60_000, requestTokens });

		await renew(account());
		advance(60_001);
		await renew(account());

		expect(requestTokens).toHaveBeenCalledTimes(2);
	});

	it('renews different refresh tokens independently', async () => {
		const { nowMs } = clock(10_000);
		const requestTokens = jest.fn(async (refreshToken: string) =>
			granted({ access_token: `renewed-${refreshToken}` }),
		);
		const renew = createRenewer({ nowMs, rememberForMs: 60_000, requestTokens });

		const [first, second] = await Promise.all([
			renew(account({ refresh_token: 'refresh-a' })),
			renew(account({ refresh_token: 'refresh-b' })),
		]);

		expect(requestTokens).toHaveBeenCalledTimes(2);
		expect(first).toMatchObject({ account: { access_token: 'renewed-refresh-a' } });
		expect(second).toMatchObject({ account: { access_token: 'renewed-refresh-b' } });
	});

	it('shares a refusal with every request that presented the same refresh token', async () => {
		const { nowMs } = clock(10_000);
		const response = deferred<TokenRequestResult>();
		const requestTokens = jest.fn(() => response.promise);
		const renew = createRenewer({ nowMs, rememberForMs: 60_000, requestTokens });

		const first = renew(account());
		const second = renew(account());
		response.resolve({ ok: false, outcome: 'refused', reason: 'invalid_grant' });

		expect(await first).toEqual({ reason: 'invalid_grant', status: 'refused' });
		expect(await second).toEqual({ reason: 'invalid_grant', status: 'refused' });
		expect(requestTokens).toHaveBeenCalledTimes(1);
	});

	it('gives a request arriving within the memory period the same refusal, without asking Keycloak again', async () => {
		const { advance, nowMs } = clock(10_000);
		const requestTokens = jest.fn(async (): Promise<TokenRequestResult> => ({
			ok: false,
			outcome: 'refused',
			reason: 'invalid_grant',
		}));
		const renew = createRenewer({ nowMs, rememberForMs: 60_000, requestTokens });

		await renew(account());
		advance(30_000);

		expect(await renew(account())).toEqual({ reason: 'invalid_grant', status: 'refused' });
		expect(requestTokens).toHaveBeenCalledTimes(1);
	});

	it('shares an unavailable Keycloak request in flight with concurrent callers', async () => {
		const { nowMs } = clock(10_000);
		const response = deferred<TokenRequestResult>();
		const requestTokens = jest.fn(() => response.promise);
		const renew = createRenewer({ nowMs, rememberForMs: 60_000, requestTokens });

		const first = renew(account());
		const second = renew(account());
		response.resolve({ ok: false, outcome: 'unavailable', reason: 'http_503' });

		expect(await first).toEqual(await second);
		expect(requestTokens).toHaveBeenCalledTimes(1);
	});

	it('asks Keycloak again on the next renewal after it was unavailable', async () => {
		const { advance, nowMs } = clock(10_000);
		const requestTokens = jest
			.fn<Promise<TokenRequestResult>, [string]>()
			.mockResolvedValueOnce({ ok: false, outcome: 'unavailable', reason: 'http_503' })
			.mockResolvedValueOnce(granted());
		const renew = createRenewer({ nowMs, rememberForMs: 60_000, requestTokens });

		await renew(account());
		advance(1_000);
		const retried = await renew(account());

		expect(requestTokens).toHaveBeenCalledTimes(2);
		expect(retried).toMatchObject({ status: 'renewed' });
	});
});
