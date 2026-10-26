import axios from 'axios';

import { getAuthOptions, getRequestKeycloakAuth, requestForcedRenewal } from './authOptions';
import { SESSION_ENDED } from './constants';
import { endKeycloakSession, requestKeycloakTokens } from './keycloakUtils';

jest.mock('axios');
// The EGO helpers load jsonwebtoken, which cannot load on Node 25 and later; these tests do not use EGO tokens.
jest.mock('@/global/utils/egoTokenUtils', () => ({ decodeToken: jest.fn(), extractUser: jest.fn() }));
jest.mock('./keycloakUtils', () => ({
	endKeycloakSession: jest.fn(),
	requestKeycloakTokens: jest.fn(),
}));

const mockedRequestTokens = requestKeycloakTokens as jest.MockedFunction<typeof requestKeycloakTokens>;
const mockedEndSession = endKeycloakSession as jest.MockedFunction<typeof endKeycloakSession>;

const nowSeconds = () => Math.floor(Date.now() / 1000);

const uniqueRefreshToken = (() => {
	const counter = { value: 0 };
	return () => `refresh-${(counter.value += 1)}`;
})();

const request = () => ({ cookies: {}, headers: {} }) as any;

const keycloakToken = ({ expiresIn = 300, refreshToken = uniqueRefreshToken() } = {}) => ({
	account: {
		access_token: 'access-current',
		expires_at: nowSeconds() + expiresIn,
		id_token: 'id-current',
		provider: 'keycloak',
		refresh_token: refreshToken,
	},
	profile: { email: 'ada@example.org', email_verified: true, family_name: 'Lovelace', given_name: 'Ada' },
	sub: 'user-1',
});

const runJwt = (req: any, params: Record<string, unknown>) =>
	getAuthOptions(req).callbacks?.jwt?.(params as any) as Promise<any>;

const runSession = (req: any, token: any) =>
	getAuthOptions(req).callbacks?.session?.({ session: { expires: '', user: {} }, token } as any) as Promise<any>;

const runSignOutEvent = (req: any, token: any) => getAuthOptions(req).events?.signOut?.({ token } as any);

const loggedEvents = (spy: jest.SpyInstance) =>
	spy.mock.calls.map(([line]) => (typeof line === 'string' && line.startsWith('{') ? JSON.parse(line) : line));

beforeEach(() => {
	jest.clearAllMocks();
	delete process.env.SESSION_IDLE_TIMEOUT_SECONDS;
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Keycloak sign-in', () => {
	it('keeps the Keycloak account and profile on the session token', async () => {
		const { account, profile } = keycloakToken();

		const token = await runJwt(request(), { account, profile, token: { sub: 'user-1' }, trigger: 'signIn' });

		expect(token).toMatchObject({ account, profile });
	});

	it('requests no permissions from Keycloak, which is used for identity only', async () => {
		const { account, profile } = keycloakToken();

		const token = await runJwt(request(), { account, profile, token: { sub: 'user-1' }, trigger: 'signIn' });

		expect(axios.post).not.toHaveBeenCalled();
		expect(mockedRequestTokens).not.toHaveBeenCalled();
		expect(token).not.toHaveProperty('scopes');
	});
});

describe('Keycloak token renewal on each session read', () => {
	it('leaves the tokens unchanged while the access token has more than a minute left', async () => {
		const token = keycloakToken({ expiresIn: 300 });

		const result = await runJwt(request(), { token });

		expect(result.account).toEqual(token.account);
		expect(mockedRequestTokens).not.toHaveBeenCalled();
	});

	it('stores renewed tokens once the access token is within a minute of expiring', async () => {
		mockedRequestTokens.mockResolvedValue({
			ok: true,
			tokens: { access_token: 'access-renewed', expires_in: 300, refresh_token: 'refresh-renewed' },
		});
		const token = keycloakToken({ expiresIn: 30 });

		const result = await runJwt(request(), { token });

		expect(mockedRequestTokens).toHaveBeenCalledWith(token.account.refresh_token);
		expect(result.account).toMatchObject({
			access_token: 'access-renewed',
			id_token: 'id-current',
			refresh_token: 'refresh-renewed',
		});
		expect(result.account.expires_at).toBeGreaterThanOrEqual(nowSeconds() + 299);
	});

	it('ends the session and keeps no access, refresh or ID token when Keycloak refuses the renewal', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'refused', reason: 'invalid_grant' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const token = keycloakToken({ expiresIn: 30 });

		const result = await runJwt(request(), { token });

		expect(result.error).toBe(SESSION_ENDED);
		expect(result.account).not.toHaveProperty('access_token');
		expect(result.account).not.toHaveProperty('refresh_token');
		expect(result.account).not.toHaveProperty('id_token');
	});

	it('logs a refused renewal as a structured event that contains no token', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'refused', reason: 'invalid_grant' });
		const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const token = keycloakToken({ expiresIn: 30 });

		await runJwt(request(), { token });

		expect(loggedEvents(errorLog)).toContainEqual(
			expect.objectContaining({ event: 'auth.keycloak.renewal_refused', outcome: 'failure', reason: 'invalid_grant' }),
		);
		expect(JSON.stringify(errorLog.mock.calls)).not.toContain(token.account.refresh_token);
		expect(JSON.stringify(errorLog.mock.calls)).not.toContain(token.account.access_token);
	});

	it('never tries to renew a session that has ended', async () => {
		const ended = { account: { provider: 'keycloak' }, error: SESSION_ENDED, sub: 'user-1' };

		const result = await runJwt(request(), { token: ended });

		expect(result).toEqual(ended);
		expect(mockedRequestTokens).not.toHaveBeenCalled();
	});
});

describe('forced renewal after an upstream rejects the access token', () => {
	const uniqueSubject = (() => {
		const counter = { value: 0 };
		return () => `forced-user-${(counter.value += 1)}`;
	})();

	it('renews immediately, even with time left on the access token', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: true, tokens: { access_token: 'access-renewed', expires_in: 300 } });
		const req = request();
		requestForcedRenewal(req);

		const result = await runJwt(req, { token: { ...keycloakToken({ expiresIn: 300 }), sub: uniqueSubject() } });

		expect(mockedRequestTokens).toHaveBeenCalledTimes(1);
		expect(result.account.access_token).toBe('access-renewed');
	});

	it('ends the session when Keycloak refuses the forced renewal', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'refused', reason: 'invalid_grant' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const req = request();
		requestForcedRenewal(req);

		const result = await runJwt(req, { token: { ...keycloakToken({ expiresIn: 300 }), sub: uniqueSubject() } });

		expect(result.error).toBe(SESSION_ENDED);
	});

	it('forces at most one renewal per person per minute, so an upstream that always rejects cannot flood Keycloak', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: true, tokens: { access_token: 'access-renewed', expires_in: 300 } });
		const subject = uniqueSubject();
		const first = request();
		const second = request();
		requestForcedRenewal(first);
		requestForcedRenewal(second);

		await runJwt(first, { token: { ...keycloakToken({ expiresIn: 300 }), sub: subject } });
		const result = await runJwt(second, { token: { ...keycloakToken({ expiresIn: 300 }), sub: subject } });

		expect(mockedRequestTokens).toHaveBeenCalledTimes(1);
		expect(result.account.access_token).toBe('access-current');
	});

	it('does not renew early for a request that was not marked', async () => {
		await runJwt(request(), { token: { ...keycloakToken({ expiresIn: 300 }), sub: uniqueSubject() } });

		expect(mockedRequestTokens).not.toHaveBeenCalled();
	});
});

describe('Keycloak unavailable during renewal', () => {
	it('keeps the session and its tokens unchanged', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'unavailable', reason: 'http_503' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const token = keycloakToken({ expiresIn: 30 });

		const result = await runJwt(request(), { token });

		expect(result).toEqual(token);
	});

	it('renews on a later read once Keycloak answers again', async () => {
		mockedRequestTokens
			.mockResolvedValueOnce({ ok: false, outcome: 'unavailable', reason: 'http_503' })
			.mockResolvedValueOnce({ ok: true, tokens: { access_token: 'access-renewed', expires_in: 300 } });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const token = keycloakToken({ expiresIn: 30 });

		const kept = await runJwt(request(), { token });
		const renewed = await runJwt(request(), { token: kept });

		expect(renewed.account.access_token).toBe('access-renewed');
	});

	it("keeps the session and its refresh token when Keycloak rejects Stage's client credentials", async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'unavailable', reason: 'invalid_client' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const token = keycloakToken({ expiresIn: 30 });

		const result = await runJwt(request(), { token });

		expect(result).not.toHaveProperty('error');
		expect(result.account.refresh_token).toBe(token.account.refresh_token);
	});

	it('logs a structured event that contains no token', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'unavailable', reason: 'http_503' });
		const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const token = keycloakToken({ expiresIn: 30 });

		await runJwt(request(), { token });

		expect(loggedEvents(errorLog)).toContainEqual(
			expect.objectContaining({ event: 'auth.keycloak.renewal_unavailable', outcome: 'failure', reason: 'http_503' }),
		);
		expect(JSON.stringify(errorLog.mock.calls)).not.toContain(token.account.refresh_token);
	});
});

describe('Keycloak access for server code handling the same request', () => {
	it('is the access token held on the session token', async () => {
		const req = request();

		await runJwt(req, { token: keycloakToken({ expiresIn: 300 }) });

		expect(getRequestKeycloakAuth(req)).toEqual({ accessToken: 'access-current', status: 'current' });
	});

	it('is the renewed access token when renewal happened during this request', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: true, tokens: { access_token: 'access-renewed', expires_in: 300 } });
		const req = request();

		await runJwt(req, { token: keycloakToken({ expiresIn: 30 }) });

		expect(getRequestKeycloakAuth(req)).toEqual({ accessToken: 'access-renewed', status: 'current' });
	});

	it('is the existing access token when Keycloak is unavailable and the token has not expired', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'unavailable', reason: 'http_503' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const req = request();

		await runJwt(req, { token: keycloakToken({ expiresIn: 30 }) });

		expect(getRequestKeycloakAuth(req)).toEqual({ accessToken: 'access-current', status: 'current' });
	});

	it('reports Keycloak as unavailable when the access token has expired and cannot be renewed', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'unavailable', reason: 'http_503' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const req = request();

		await runJwt(req, { token: keycloakToken({ expiresIn: -10 }) });

		expect(getRequestKeycloakAuth(req)).toEqual({ status: 'unavailable' });
	});

	it('is absent when the session has ended', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'refused', reason: 'invalid_grant' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const req = request();

		await runJwt(req, { token: keycloakToken({ expiresIn: 30 }) });

		expect(getRequestKeycloakAuth(req)).toBeUndefined();
	});

	it('belongs only to the request whose session was read', async () => {
		await runJwt(request(), { token: keycloakToken({ expiresIn: 300 }) });

		expect(getRequestKeycloakAuth(request())).toBeUndefined();
	});
});

describe('session sent to the browser', () => {
	it("holds the user's name, email and id, and none of the access, refresh or ID tokens", async () => {
		const token = keycloakToken();

		const session = await runSession(request(), token);
		const serialized = JSON.stringify(session);

		expect(session.user).toMatchObject({
			email: 'ada@example.org',
			firstName: 'Ada',
			id: 'user-1',
			lastName: 'Lovelace',
		});
		expect(serialized).not.toContain(token.account.access_token);
		expect(serialized).not.toContain(token.account.refresh_token);
		expect(serialized).not.toContain(token.account.id_token);
	});

	it('is marked as ended when renewal has failed', async () => {
		const session = await runSession(request(), {
			account: { provider: 'keycloak' },
			error: SESSION_ENDED,
			profile: {},
			sub: 'user-1',
		});

		expect(session.error).toBe(SESSION_ENDED);
	});
});

describe('Keycloak sign-out', () => {
	it("ends the user's Keycloak session using the session's refresh token", async () => {
		mockedEndSession.mockResolvedValue({ ok: true });
		const token = keycloakToken();

		await runSignOutEvent(request(), token);

		expect(mockedEndSession).toHaveBeenCalledWith(token.account.refresh_token);
	});

	it("completes Stage's sign-out and logs a structured event when Keycloak refuses the logout", async () => {
		mockedEndSession.mockResolvedValue({ ok: false, reason: 'http_400' });
		const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);

		await expect(runSignOutEvent(request(), keycloakToken())).resolves.toBeUndefined();

		expect(loggedEvents(errorLog)).toContainEqual(
			expect.objectContaining({ event: 'auth.keycloak.logout_failed', outcome: 'failure', reason: 'http_400' }),
		);
	});

	it("completes Stage's sign-out when Keycloak cannot be reached", async () => {
		mockedEndSession.mockRejectedValue(new Error('connect ECONNREFUSED'));
		jest.spyOn(console, 'error').mockImplementation(() => undefined);

		await expect(runSignOutEvent(request(), keycloakToken())).resolves.toBeUndefined();
	});

	it('does not call Keycloak for a session that has already ended', async () => {
		await runSignOutEvent(request(), { account: { provider: 'keycloak' }, error: SESSION_ENDED });

		expect(mockedEndSession).not.toHaveBeenCalled();
	});
});

describe('session idle limit', () => {
	it('is SESSION_IDLE_TIMEOUT_SECONDS when set', () => {
		process.env.SESSION_IDLE_TIMEOUT_SECONDS = '900';

		expect(getAuthOptions(request()).session?.maxAge).toBe(900);
	});

	it("defaults to 30 minutes, Keycloak's default SSO idle limit", () => {
		expect(getAuthOptions(request()).session?.maxAge).toBe(30 * 60);
	});

	it('falls back to 30 minutes when the configured value is not a positive whole number', () => {
		process.env.SESSION_IDLE_TIMEOUT_SECONDS = 'thirty';

		expect(getAuthOptions(request()).session?.maxAge).toBe(30 * 60);
	});
});
