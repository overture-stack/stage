import { getSession } from 'next-auth/react';

import { readPageSession, sessionEndpoint } from './readPageSession';

jest.mock('next-auth/react', () => ({ getSession: jest.fn() }));

const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;

const pageResponse = (initial: Record<string, string[]> = {}) => {
	const headers: Record<string, string[]> = { ...initial };
	return {
		getHeader: (name: string) => headers[name.toLowerCase()],
		headers,
		setHeader: (name: string, value: string[]) => {
			headers[name.toLowerCase()] = value;
		},
	};
};

// Undici, Node's built-in fetch, exposes getSetCookie; node-fetch exposes raw.
const undiciResponse = (body: unknown, setCookies: string[] = [], status = 200) => ({
	headers: { getSetCookie: () => setCookies },
	json: async () => body,
	ok: status < 400,
	status,
});

const nodeFetchResponse = (body: unknown, setCookies: string[] = []) => ({
	headers: { raw: () => ({ 'set-cookie': setCookies }) },
	json: async () => body,
	ok: true,
	status: 200,
});

const serverContext = (cookie = 'next-auth.session-token=abc', res = pageResponse()) =>
	({ req: { headers: { cookie } }, res }) as any;

beforeEach(() => {
	jest.clearAllMocks();
});

describe('sessionEndpoint', () => {
	it("adds NextAuth's default /api/auth path when the configured URL has no path", () => {
		expect(sessionEndpoint('https://vanilla.dev.overture.bio')).toBe('https://vanilla.dev.overture.bio/api/auth/session');
	});

	it('keeps a configured NextAuth path', () => {
		expect(sessionEndpoint('https://vanilla.dev.overture.bio/api/auth')).toBe(
			'https://vanilla.dev.overture.bio/api/auth/session',
		);
	});

	it('tolerates a trailing slash', () => {
		expect(sessionEndpoint('https://vanilla.dev.overture.bio/api/auth/')).toBe(
			'https://vanilla.dev.overture.bio/api/auth/session',
		);
	});
});

describe('readPageSession during server rendering', () => {
	it("reads the session with the browser's cookies and returns it", async () => {
		const session = { expires: 'later', user: { id: 'user-1' } };
		const fetchSession = jest.fn(async () => undiciResponse(session));

		const result = await readPageSession(serverContext('next-auth.session-token=abc'), {
			baseUrl: 'https://stage.example/api/auth',
			fetchSession,
		});

		expect(result).toEqual(session);
		expect(fetchSession).toHaveBeenCalledWith('https://stage.example/api/auth/session', {
			headers: { cookie: 'next-auth.session-token=abc' },
		});
	});

	it('passes every cookie NextAuth sets while reading the session on to the page response', async () => {
		const res = pageResponse();
		const renewed = ['next-auth.session-token=renewed; Path=/; HttpOnly'];
		const fetchSession = jest.fn(async () => undiciResponse({ user: {} }, renewed));

		await readPageSession(serverContext(undefined, res), { baseUrl: 'https://stage.example', fetchSession });

		expect(res.headers['set-cookie']).toEqual(renewed);
	});

	it('reads the cookies NextAuth sets when the server uses node-fetch', async () => {
		const res = pageResponse();
		const renewed = ['next-auth.session-token=renewed; Path=/; HttpOnly'];
		const fetchSession = jest.fn(async () => nodeFetchResponse({ user: {} }, renewed));

		await readPageSession(serverContext(undefined, res), { baseUrl: 'https://stage.example', fetchSession });

		expect(res.headers['set-cookie']).toEqual(renewed);
	});

	it('keeps cookies the page response already sets', async () => {
		const res = pageResponse({ 'set-cookie': ['existing=1'] });
		const fetchSession = jest.fn(async () => undiciResponse({ user: {} }, ['next-auth.session-token=renewed']));

		await readPageSession(serverContext(undefined, res), { baseUrl: 'https://stage.example', fetchSession });

		expect(res.headers['set-cookie']).toEqual(['existing=1', 'next-auth.session-token=renewed']);
	});

	it('returns no session when NextAuth reports none', async () => {
		const fetchSession = jest.fn(async () => undiciResponse({}));

		const result = await readPageSession(serverContext(), { baseUrl: 'https://stage.example', fetchSession });

		expect(result).toBeNull();
	});

	it('returns no session when the session endpoint fails', async () => {
		const fetchSession = jest.fn(async () => undiciResponse({ message: 'error' }, [], 500));

		const result = await readPageSession(serverContext(), { baseUrl: 'https://stage.example', fetchSession });

		expect(result).toBeNull();
	});
});

describe('readPageSession in the browser', () => {
	it("uses NextAuth's client, which updates the browser's cookies itself", async () => {
		const session = { expires: 'later', user: { id: 'user-1' } };
		mockedGetSession.mockResolvedValue(session as any);
		const fetchSession = jest.fn();

		const result = await readPageSession({} as any, { baseUrl: 'https://stage.example', fetchSession });

		expect(result).toEqual(session);
		expect(fetchSession).not.toHaveBeenCalled();
	});
});
