import { endKeycloakSession, requestKeycloakTokens } from './keycloakUtils';

const fetchMock = jest.fn();

const keycloakAnswer = (status: number, body: unknown = {}) => ({
	json: async () => body,
	ok: status >= 200 && status < 300,
	status,
});

const sentForm = (): URLSearchParams => fetchMock.mock.calls[0][1].body;

beforeEach(() => {
	fetchMock.mockReset();
	(global as any).fetch = fetchMock;
	process.env.KEYCLOAK_CLIENT_SECRET = 'client-secret';
});

afterAll(() => {
	delete process.env.KEYCLOAK_CLIENT_SECRET;
});

describe('requestKeycloakTokens', () => {
	it("returns Keycloak's new tokens when it grants the refresh", async () => {
		const tokens = { access_token: 'access-2', expires_in: 300, refresh_token: 'refresh-2' };
		fetchMock.mockResolvedValue(keycloakAnswer(200, tokens));

		expect(await requestKeycloakTokens('refresh-1')).toEqual({ ok: true, tokens });
	});

	it("sends the refresh token with the client's credentials as a refresh grant", async () => {
		fetchMock.mockResolvedValue(keycloakAnswer(200, { access_token: 'a', expires_in: 300 }));

		await requestKeycloakTokens('refresh-1');

		expect(sentForm().get('grant_type')).toBe('refresh_token');
		expect(sentForm().get('refresh_token')).toBe('refresh-1');
		expect(sentForm().get('client_secret')).toBe('client-secret');
	});

	it('treats invalid_grant as a refusal, since the refresh token is no longer good', async () => {
		fetchMock.mockResolvedValue(keycloakAnswer(400, { error: 'invalid_grant' }));

		expect(await requestKeycloakTokens('refresh-1')).toEqual({ ok: false, outcome: 'refused', reason: 'invalid_grant' });
	});

	it("treats a rejection of Stage's own client credentials as Keycloak being unavailable, not as the session ending", async () => {
		fetchMock.mockResolvedValue(keycloakAnswer(401, { error: 'invalid_client' }));

		expect(await requestKeycloakTokens('refresh-1')).toEqual({
			ok: false,
			outcome: 'unavailable',
			reason: 'invalid_client',
		});
	});

	it("treats any other 400 answer as Keycloak being unavailable, since it describes Stage's request", async () => {
		fetchMock.mockResolvedValue(keycloakAnswer(400, { error: 'invalid_request' }));

		expect(await requestKeycloakTokens('refresh-1')).toEqual({
			ok: false,
			outcome: 'unavailable',
			reason: 'invalid_request',
		});
	});

	it('treats a server error as Keycloak being unavailable', async () => {
		fetchMock.mockResolvedValue(keycloakAnswer(503));

		expect(await requestKeycloakTokens('refresh-1')).toEqual({ ok: false, outcome: 'unavailable', reason: 'http_503' });
	});

	it('limits the request with a timeout, so a Keycloak that never answers cannot hold the session', async () => {
		fetchMock.mockResolvedValue(keycloakAnswer(200, { access_token: 'a', expires_in: 300 }));

		await requestKeycloakTokens('refresh-1');

		expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
	});
});

describe('endKeycloakSession', () => {
	it("ends the session with the refresh token and the client's credentials", async () => {
		fetchMock.mockResolvedValue(keycloakAnswer(204));

		expect(await endKeycloakSession('refresh-1')).toEqual({ ok: true });
		expect(fetchMock.mock.calls[0][0]).toMatch(/protocol\/openid-connect\/logout$/);
		expect(sentForm().get('refresh_token')).toBe('refresh-1');
		expect(sentForm().get('client_secret')).toBe('client-secret');
	});

	it("reports Keycloak's reason when it refuses the logout", async () => {
		fetchMock.mockResolvedValue(keycloakAnswer(400, { error: 'invalid_grant' }));

		expect(await endKeycloakSession('refresh-1')).toEqual({ ok: false, reason: 'invalid_grant' });
	});

	it('limits the request with a timeout', async () => {
		fetchMock.mockResolvedValue(keycloakAnswer(204));

		await endKeycloakSession('refresh-1');

		expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
	});
});
