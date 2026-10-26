import type { NextPageContext } from 'next';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

import { getConfig } from '@/global/config';

type SessionResponseHeaders = {
	getSetCookie?: () => string[];
	raw?: () => Record<string, string[]>;
};

type SessionResponse = {
	headers: SessionResponseHeaders;
	json: () => Promise<any>;
	ok: boolean;
};

type FetchSession = (url: string, init: { headers: Record<string, string> }) => Promise<SessionResponse>;

// NextAuth's own default when NEXTAUTH_URL is unset.
const DEFAULT_NEXTAUTH_URL = 'http://localhost:3000';

/** NextAuth's session endpoint under `baseUrl`, adding NextAuth's default `/api/auth` path when there is none. */
export const sessionEndpoint = (baseUrl: string): string => {
	const url = new URL(baseUrl || DEFAULT_NEXTAUTH_URL);
	const authPath = url.pathname.replace(/\/+$/, '') || '/api/auth';
	return `${url.origin}${authPath}/session`;
};

// Undici, Node's built-in fetch, exposes getSetCookie; node-fetch exposes raw.
const setCookiesFrom = (headers: SessionResponseHeaders): string[] =>
	headers.getSetCookie?.() ?? headers.raw?.()['set-cookie'] ?? [];

const passOnCookies = (res: NonNullable<NextPageContext['res']>, cookies: string[]): void => {
	if (cookies.length > 0) {
		const existing = res.getHeader('Set-Cookie');
		const current = existing === undefined ? [] : ([] as Array<string | number>).concat(existing).map(String);
		res.setHeader('Set-Cookie', [...current, ...cookies]);
	}
};

/**
 * Reads the session for a page. During server rendering it asks NextAuth's session endpoint directly and passes
 * on any cookie NextAuth sets while reading, such as a renewed session, which NextAuth's own `getSession` drops
 * on the server. In the browser it uses `getSession`, which keeps the browser's cookies current itself.
 */
export const readPageSession = async (
	ctx: Pick<NextPageContext, 'req' | 'res'>,
	{ baseUrl = getConfig().NEXTAUTH_URL, fetchSession = fetch as unknown as FetchSession } = {},
): Promise<Session | null> => {
	if (ctx.req && ctx.res) {
		const cookie = ctx.req.headers.cookie;
		const response = await fetchSession(sessionEndpoint(baseUrl), { headers: cookie ? { cookie } : {} });
		passOnCookies(ctx.res, setCookiesFrom(response.headers));
		const body = response.ok ? await response.json() : null;
		return body && Object.keys(body).length > 0 ? body : null;
	}

	return getSession();
};
