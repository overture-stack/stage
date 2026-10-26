import { getServerSession } from 'next-auth/next';
import { PassThrough, Readable } from 'stream';

import { SESSION_ENDED } from './constants';
import { requestKeycloakTokens } from './keycloakUtils';
import { failProxyResponse, getProxyAuthorization, relayProxyResponse } from './protectedProxyAuth';

jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
// The EGO helpers load jsonwebtoken, which cannot load on Node 25 and later; these tests do not use EGO tokens.
jest.mock('@/global/utils/egoTokenUtils', () => ({ decodeToken: jest.fn(), extractUser: jest.fn() }));
jest.mock('./keycloakUtils', () => ({
	endKeycloakSession: jest.fn(),
	requestKeycloakTokens: jest.fn(),
}));

const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockedRequestTokens = requestKeycloakTokens as jest.MockedFunction<typeof requestKeycloakTokens>;

const nowSeconds = () => Math.floor(Date.now() / 1000);

// Reads the session the way NextAuth does: the jwt callback first, then the session callback.
const sessionReadFrom = (token: unknown) =>
	(async (_req: unknown, _res: unknown, options: any) => {
		const current = await options.callbacks.jwt({ token });
		return options.callbacks.session({ session: { expires: '', user: {} }, token: current });
	}) as any;

const keycloakToken = (refreshToken: string, expiresIn: number) => ({
	account: {
		access_token: 'access-current',
		expires_at: nowSeconds() + expiresIn,
		provider: 'keycloak',
		refresh_token: refreshToken,
	},
	profile: {},
	sub: 'user-1',
});

const request = () => ({ cookies: {}, headers: {} }) as any;
const response = () => ({}) as any;

beforeEach(() => {
	jest.clearAllMocks();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('getProxyAuthorization', () => {
	it("forwards a current Keycloak session's access token as a bearer token", async () => {
		mockedGetServerSession.mockImplementation(sessionReadFrom(keycloakToken('refresh-proxy-1', 300)));

		const result = await getProxyAuthorization(request(), response());

		expect(result).toEqual({ authorization: 'Bearer access-current', status: 'forward' });
	});

	it('forwards the access token renewed while handling this request', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: true, tokens: { access_token: 'access-renewed', expires_in: 300 } });
		mockedGetServerSession.mockImplementation(sessionReadFrom(keycloakToken('refresh-proxy-2', 30)));

		const result = await getProxyAuthorization(request(), response());

		expect(result).toEqual({ authorization: 'Bearer access-renewed', status: 'forward' });
	});

	it('refuses a request whose session has ended, so nothing is forwarded', async () => {
		mockedGetServerSession.mockImplementation(
			sessionReadFrom({ account: { provider: 'keycloak' }, error: SESSION_ENDED, profile: {}, sub: 'user-1' }),
		);

		const result = await getProxyAuthorization(request(), response());

		expect(result).toEqual({ status: 'refused' });
	});

	it('refuses a request whose session ends because Keycloak refuses the renewal during this request', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'refused', reason: 'invalid_grant' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		mockedGetServerSession.mockImplementation(sessionReadFrom(keycloakToken('refresh-proxy-3', 30)));

		const result = await getProxyAuthorization(request(), response());

		expect(result).toEqual({ status: 'refused' });
	});

	it('forwards the existing access token while Keycloak is unavailable and the token has not expired', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'unavailable', reason: 'http_503' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		mockedGetServerSession.mockImplementation(sessionReadFrom(keycloakToken('refresh-proxy-4', 30)));

		const result = await getProxyAuthorization(request(), response());

		expect(result).toEqual({ authorization: 'Bearer access-current', status: 'forward' });
	});

	it('answers that Keycloak is unavailable when the access token has expired and cannot be renewed', async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'unavailable', reason: 'http_503' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		mockedGetServerSession.mockImplementation(sessionReadFrom(keycloakToken('refresh-proxy-5', -10)));

		const result = await getProxyAuthorization(request(), response());

		expect(result).toEqual({ status: 'unavailable' });
	});

	it('refuses a Keycloak session whose access token cannot be found for this request', async () => {
		mockedGetServerSession.mockResolvedValue({ account: { provider: 'keycloak' }, expires: '', user: {} } as any);

		const result = await getProxyAuthorization(request(), response());

		expect(result).toEqual({ status: 'refused' });
	});

	it('forwards a request without a session with no authorization, as public data needs no sign-in', async () => {
		mockedGetServerSession.mockResolvedValue(null);

		const result = await getProxyAuthorization(request(), response());

		expect(result).toEqual({ status: 'forward' });
	});

	it("forwards an EGO session's token as a bearer token", async () => {
		mockedGetServerSession.mockImplementation(
			sessionReadFrom({ account: { provider: 'ego' }, profile: { egoToken: 'ego-jwt', scope: [] } }),
		);

		const result = await getProxyAuthorization(request(), response());

		expect(result).toEqual({ authorization: 'Bearer ego-jwt', status: 'forward' });
	});
});

describe('relayProxyResponse', () => {
	const uniqueSubject = (() => {
		const counter = { value: 0 };
		return () => `relay-user-${(counter.value += 1)}`;
	})();

	const keycloakSession = () => ({ ...keycloakToken(`refresh-${uniqueSubject()}`, 300), sub: uniqueSubject() });

	const upstreamResponse = (statusCode: number, headers: Record<string, unknown> = {}, body = 'upstream body') =>
		Object.assign(Readable.from([body]), { headers, statusCode }) as any;

	const pageResponse = () => {
		const headers: Record<string, unknown> = {};
		const res: any = Object.assign(new PassThrough(), {
			getHeader: (name: string) => headers[name.toLowerCase()],
			headers,
			setHeader: (name: string, value: unknown) => {
				headers[name.toLowerCase()] = value;
			},
			statusCode: 200,
		});
		res.status = (code: number) => {
			res.statusCode = code;
			return res;
		};
		res.json = (body: unknown) => {
			res.setHeader('content-type', 'application/json');
			res.end(JSON.stringify(body));
		};
		return res;
	};

	const bodyOf = async (res: PassThrough): Promise<string> => {
		const chunks: Buffer[] = [];
		for await (const chunk of res) {
			chunks.push(Buffer.from(chunk));
		}
		return Buffer.concat(chunks).toString();
	};

	const forwardedWithKeycloak = async () => {
		mockedGetServerSession.mockImplementation(sessionReadFrom(keycloakSession()));
		const req = request();
		const res = pageResponse();
		await getProxyAuthorization(req, res);
		return { req, res };
	};

	it("answers the proxy's own 401 session_ended when the forced renewal after an upstream 401 ends the session", async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'refused', reason: 'invalid_grant' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const { req, res } = await forwardedWithKeycloak();

		await relayProxyResponse(upstreamResponse(401, { 'x-upstream': 'yes' }), req, res);

		expect(res.statusCode).toBe(401);
		expect(res.headers).not.toHaveProperty('x-upstream');
		expect(res.headers['x-stage-session']).toBe('ended');
		expect(JSON.parse(await bodyOf(res))).toEqual({ error: 'session_ended' });
	});

	it("relays the upstream's 401 unchanged when the forced renewal keeps the session", async () => {
		mockedRequestTokens.mockResolvedValue({ ok: true, tokens: { access_token: 'access-renewed', expires_in: 300 } });
		const { req, res } = await forwardedWithKeycloak();

		await relayProxyResponse(upstreamResponse(401), req, res);

		expect(mockedRequestTokens).toHaveBeenCalledTimes(1);
		expect(res.statusCode).toBe(401);
		expect(await bodyOf(res)).toBe('upstream body');
	});

	it('relays an upstream success without renewing', async () => {
		const { req, res } = await forwardedWithKeycloak();

		await relayProxyResponse(upstreamResponse(200), req, res);

		expect(mockedRequestTokens).not.toHaveBeenCalled();
		expect(res.statusCode).toBe(200);
	});

	it('does not renew for an upstream 401 to a request sent without credentials', async () => {
		mockedGetServerSession.mockResolvedValue(null);
		const req = request();
		const res = pageResponse();
		await getProxyAuthorization(req, res);

		await relayProxyResponse(upstreamResponse(401), req, res);

		expect(mockedGetServerSession).toHaveBeenCalledTimes(1);
		expect(res.statusCode).toBe(401);
	});

	it('relays the upstream status, headers and body', async () => {
		mockedGetServerSession.mockResolvedValue(null);
		const req = request();
		const res = pageResponse();
		await getProxyAuthorization(req, res);

		await relayProxyResponse(upstreamResponse(201, { 'content-type': 'application/json' }, '{"id":1}'), req, res);

		expect(res.statusCode).toBe(201);
		expect(res.headers).toEqual({ 'content-type': 'application/json' });
		expect(await bodyOf(res)).toBe('{"id":1}');
	});

	it("relays none of the upstream's cookies, authentication challenges or connection-level headers", async () => {
		mockedGetServerSession.mockResolvedValue(null);
		const req = request();
		const res = pageResponse();
		await getProxyAuthorization(req, res);

		await relayProxyResponse(
			upstreamResponse(200, {
				connection: 'keep-alive, x-hop',
				'content-type': 'text/plain',
				'keep-alive': 'timeout=5',
				'proxy-authenticate': 'Basic',
				'set-cookie': ['upstream=1'],
				trailer: 'x-checksum',
				'transfer-encoding': 'chunked',
				upgrade: 'h2c',
				'www-authenticate': 'Basic realm="upstream"',
				'x-hop': 'only-for-this-connection',
				'x-stage-session': 'ended',
			}),
			req,
			res,
		);

		expect(res.headers).toEqual({ 'content-type': 'text/plain' });
	});

	it('closes the page response when the upstream fails partway through its body', async () => {
		mockedGetServerSession.mockResolvedValue(null);
		const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const req = request();
		const res = pageResponse();
		await getProxyAuthorization(req, res);
		const failing = Object.assign(
			new Readable({
				read() {
					this.push('partial');
					this.destroy(new Error('socket hang up'));
				},
			}),
			{ headers: {}, statusCode: 200 },
		) as any;

		await relayProxyResponse(failing, req, res);
		await new Promise((resolve) => res.on('close', resolve));

		expect(res.destroyed).toBe(true);
		expect(errorLog.mock.calls.map(([line]) => JSON.parse(line))).toContainEqual(
			expect.objectContaining({ event: 'proxy.relay_interrupted', outcome: 'failure' }),
		);
	});
});

describe('failProxyResponse', () => {
	const failingResponse = (headersSent: boolean, headers: Record<string, unknown> = {}) => {
		const res: any = {
			destroy: jest.fn(),
			getHeaderNames: () => Object.keys(headers),
			headers,
			headersSent,
			removeHeader: (name: string) => {
				delete headers[name];
			},
		};
		res.status = jest.fn(() => res);
		res.json = jest.fn();
		return res;
	};

	it("drops upstream headers already set, keeping Stage's session cookie, before answering 502", () => {
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const res = failingResponse(false, {
			'content-length': '512',
			'content-type': 'text/html',
			'set-cookie': ['next-auth.session-token=renewed'],
		});

		failProxyResponse(res, new Error('failed while copying headers'), 'proxy.relay_failed');

		expect(res.headers).toEqual({ 'set-cookie': ['next-auth.session-token=renewed'] });
		expect(res.status).toHaveBeenCalledWith(502);
	});

	it('answers a fixed 502 with no detail of the failure when nothing has been sent yet', () => {
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const res = failingResponse(false);
		const error = Object.assign(new Error('connect ECONNREFUSED 10.0.0.5:8080'), {
			address: '10.0.0.5',
			code: 'ECONNREFUSED',
			port: 8080,
		});

		failProxyResponse(res, error, 'proxy.upstream_unreachable');

		expect(res.status).toHaveBeenCalledWith(502);
		expect(res.json).toHaveBeenCalledWith({ error: 'upstream_failed' });
		expect(JSON.stringify(res.json.mock.calls)).not.toContain('10.0.0.5');
	});

	it('closes the response when headers have already been sent', () => {
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const res = failingResponse(true);

		failProxyResponse(res, new Error('late failure'), 'proxy.relay_failed');

		expect(res.destroy).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
	});

	it('logs the failure detail as a structured event on the server', () => {
		const errorLog = jest.spyOn(console, 'error').mockImplementation(() => undefined);

		failProxyResponse(failingResponse(false), Object.assign(new Error('refused'), { code: 'ECONNREFUSED' }), 'proxy.upstream_unreachable');

		expect(errorLog.mock.calls.map(([line]) => JSON.parse(line))).toContainEqual(
			expect.objectContaining({ event: 'proxy.upstream_unreachable', outcome: 'failure', reason: 'ECONNREFUSED' }),
		);
	});
});
