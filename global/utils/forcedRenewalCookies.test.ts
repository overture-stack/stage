import { decode, encode } from 'next-auth/jwt';
import { PassThrough, Readable } from 'stream';

import { SESSION_ENDED } from './constants';
import { requestKeycloakTokens } from './keycloakUtils';
import { getProxyAuthorization, relayProxyResponse } from './protectedProxyAuth';

// The EGO helpers load jsonwebtoken, which cannot load on Node 25 and later; these tests do not use EGO tokens.
jest.mock('@/global/utils/egoTokenUtils', () => ({ decodeToken: jest.fn(), extractUser: jest.fn() }));
jest.mock('./keycloakUtils', () => ({
	endKeycloakSession: jest.fn(),
	requestKeycloakTokens: jest.fn(),
}));

const mockedRequestTokens = requestKeycloakTokens as jest.MockedFunction<typeof requestKeycloakTokens>;

// Jest 27's Node environment does not expose the Fetch API's Request, which NextAuth only uses to tell a Web
// request from a Node one. These tests pass Node-style requests, so an empty class answers that check.
if (typeof (globalThis as any).Request === 'undefined') {
	(globalThis as any).Request = class {};
}

const SECRET = 'session-secret-for-chunked-cookie-test-0123456789';
const COOKIE_NAME = 'next-auth.session-token';
// NextAuth's chunk size: 4096 bytes allowed per cookie, less its estimate of an empty cookie's size.
const CHUNK_SIZE = 4096 - 163;

const saved = { NEXTAUTH_URL: process.env.NEXTAUTH_URL, SESSION_ENCRYPTION_SECRET: process.env.SESSION_ENCRYPTION_SECRET };

beforeAll(() => {
	process.env.NEXTAUTH_URL = 'http://localhost:3000';
	process.env.SESSION_ENCRYPTION_SECRET = SECRET;
});

afterAll(() => {
	Object.entries(saved).forEach(([name, value]) =>
		value === undefined ? delete process.env[name] : (process.env[name] = value),
	);
});

const chunkedSessionCookies = async (): Promise<Record<string, string>> => {
	const nowSeconds = Math.floor(Date.now() / 1000);
	const value = await encode({
		secret: SECRET,
		token: {
			account: {
				access_token: 'a'.repeat(6000),
				expires_at: nowSeconds + 300,
				id_token: 'i'.repeat(1500),
				provider: 'keycloak',
				refresh_token: 'refresh-chunked',
			},
			profile: {},
			sub: 'chunked-user',
		},
	});
	const chunkCount = Math.ceil(value.length / CHUNK_SIZE);
	return Object.fromEntries(
		Array.from({ length: chunkCount }, (_, index) => [
			`${COOKIE_NAME}.${index}`,
			value.substr(index * CHUNK_SIZE, CHUNK_SIZE),
		]),
	);
};

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
	res.json = (body: unknown) => res.end(JSON.stringify(body));
	return res;
};

// Applies Set-Cookie headers in order, as a browser does: a later cookie of the same name replaces an earlier
// one, and Max-Age=0 removes it.
const browserCookiesAfter = (requestCookies: Record<string, string>, setCookies: string[]): Record<string, string> =>
	setCookies.reduce(
		(jar, header) => {
			const [pair, ...attributes] = header.split(';').map((part) => part.trim());
			const [name, ...valueParts] = pair.split('=');
			const isRemoval = attributes.some((attribute) => attribute.toLowerCase() === 'max-age=0');
			const { [name]: _replaced, ...others } = jar;
			return isRemoval ? others : { ...others, [name]: valueParts.join('=') };
		},
		{ ...requestCookies },
	);

const sessionCookieValue = (jar: Record<string, string>): string =>
	Object.keys(jar)
		.filter((name) => name.startsWith(COOKIE_NAME))
		.sort((a, b) => Number(a.split('.').pop()) - Number(b.split('.').pop()))
		.map((name) => jar[name])
		.join('');

describe('a forced renewal that ends a session held in a chunked cookie', () => {
	it("leaves the browser holding only the ended session, with no chunk of the earlier one", async () => {
		mockedRequestTokens.mockResolvedValue({ ok: false, outcome: 'refused', reason: 'invalid_grant' });
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
		const requestCookies = await chunkedSessionCookies();
		expect(Object.keys(requestCookies).length).toBeGreaterThan(1);
		const req: any = {
			cookies: requestCookies,
			headers: {
				cookie: Object.entries(requestCookies)
					.map(([name, value]) => `${name}=${value}`)
					.join('; '),
				host: 'localhost:3000',
			},
			method: 'GET',
			url: '/api/protected/keycloak/apikey',
		};
		const res = pageResponse();

		await getProxyAuthorization(req, res);
		await relayProxyResponse(Object.assign(Readable.from(['rejected']), { headers: {}, statusCode: 401 }) as any, req, res);

		const jar = browserCookiesAfter(requestCookies, res.getHeader('set-cookie') as string[]);
		const session: any = await decode({ secret: SECRET, token: sessionCookieValue(jar) });
		expect(res.statusCode).toBe(401);
		expect(Object.keys(jar).filter((name) => name.startsWith(`${COOKIE_NAME}.`))).toEqual([]);
		expect(session.error).toBe(SESSION_ENDED);
		expect(session.account).not.toHaveProperty('access_token');
	});
});
