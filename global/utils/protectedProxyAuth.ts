import type { IncomingHttpHeaders, IncomingMessage } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { pipeline } from 'stream';

import { AUTH_PROVIDER, SESSION_ENDED, SESSION_ENDED_HEADER } from '@/global/utils/constants';
import { decryptContent } from '@/global/utils/crypt';

import { getAuthOptions, getRequestKeycloakAuth, requestForcedRenewal } from './authOptions';

/**
 * Whether the protected proxy forwards a request, and with which `Authorization` header if any; refuses it; or
 * cannot decide because Keycloak is unavailable to renew an expired access token.
 */
export type ProxyAuthorization =
	| { authorization?: string; status: 'forward' }
	| { status: 'refused' }
	| { status: 'unavailable' };

const bearer = (accessToken: string): ProxyAuthorization => ({ authorization: `Bearer ${accessToken}`, status: 'forward' });

const keycloakForwardedRequests = new WeakSet<object>();

const keycloakAuthorization = (req: NextApiRequest): ProxyAuthorization => {
	const keycloakAuth = getRequestKeycloakAuth(req);
	if (keycloakAuth?.status === 'current') {
		keycloakForwardedRequests.add(req);
		return bearer(keycloakAuth.accessToken);
	}
	return keycloakAuth?.status === 'unavailable' ? { status: 'unavailable' } : { status: 'refused' };
};

/**
 * Reads the request's session, renewing it if due, and decides what the protected proxy forwards. A Keycloak
 * session is forwarded only with its current access token, never as anonymous: an ended session, or one whose
 * token cannot be found, is refused. Requests without a session are forwarded without credentials.
 */
export const getProxyAuthorization = async (
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<ProxyAuthorization> => {
	const session: any = await getServerSession(req, res, getAuthOptions(req));
	if (session?.error === SESSION_ENDED) {
		return { status: 'refused' };
	}
	if (session?.account?.provider === AUTH_PROVIDER.KEYCLOAK) {
		return keycloakAuthorization(req);
	}

	return session?.account?.accessToken ? bearer(decryptContent(session.account.accessToken)) : { status: 'forward' };
};

const logProxyEvent = (fields: { event: string; outcome: string; reason: string }): void => {
	console.error(JSON.stringify({ ...fields, timestamp: new Date().toISOString() }));
};

const describeError = (error: unknown): string =>
	typeof (error as { code?: unknown })?.code === 'string'
		? (error as { code: string }).code
		: error instanceof Error
		? error.message
		: String(error);

/**
 * Ends the page's response after a proxy failure: a fixed 502 when nothing has been sent yet, otherwise the
 * connection is closed. The failure's detail goes to the server log only.
 */
export const failProxyResponse = (res: NextApiResponse, error: unknown, event: string): void => {
	logProxyEvent({ event, outcome: 'failure', reason: describeError(error) });
	if (res.headersSent) {
		res.destroy();
	} else {
		// Upstream headers already copied would contradict the 502; the session cookie must still reach the browser.
		res
			.getHeaderNames()
			.filter((name) => name.toLowerCase() !== 'set-cookie')
			.forEach((name) => res.removeHeader(name));
		res.status(502).json({ error: 'upstream_failed' });
	}
};

/** Answers that the session has ended, marked so the page can tell this answer from any upstream's. */
export const answerSessionEnded = (res: NextApiResponse): void => {
	res.setHeader(SESSION_ENDED_HEADER, 'ended');
	res.status(401).json({ error: 'session_ended' });
};

// Connection-level headers belong to the hop between the proxy and the upstream. Cookies and authentication
// challenges are withheld because Stage's own session is the page's credential: an upstream cookie could replace
// it, and a challenge could make the browser prompt for a password on Stage's origin.
const WITHHELD_HEADERS = [
	'connection',
	'keep-alive',
	'proxy-authenticate',
	'proxy-authorization',
	'set-cookie',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'www-authenticate',
	SESSION_ENDED_HEADER,
];

const relayableHeaders = (headers: IncomingHttpHeaders): Array<[string, string | string[]]> => {
	const namedByConnection = String(headers.connection ?? '')
		.split(',')
		.map((name) => name.trim().toLowerCase())
		.filter((name) => name.length > 0);
	const withheld = new Set([...WITHHELD_HEADERS, ...namedByConnection]);
	return Object.entries(headers).filter(
		(entry): entry is [string, string | string[]] => entry[1] !== undefined && !withheld.has(entry[0].toLowerCase()),
	);
};

const renewAfterRejection = async (req: NextApiRequest, res: NextApiResponse): Promise<boolean> => {
	requestForcedRenewal(req);
	const session: any = await getServerSession(req, res, getAuthOptions(req)).catch(() => null);
	return session?.error === SESSION_ENDED;
};

/**
 * Relays an upstream response to the page, without connection-level headers, cookies or authentication
 * challenges. When the upstream answers 401 to a request sent with a Keycloak access token, the session is
 * renewed first, so Keycloak decides at once whether it goes on. If Keycloak has ended it, the page gets the
 * proxy's own 401 `session_ended` instead of the upstream's answer.
 */
export const relayProxyResponse = async (
	proxyResponse: IncomingMessage,
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<void> => {
	const isUpstreamRejection = proxyResponse.statusCode === 401 && keycloakForwardedRequests.has(req);
	const hasSessionEnded = isUpstreamRejection && (await renewAfterRejection(req, res));
	if (hasSessionEnded) {
		proxyResponse.resume();
		answerSessionEnded(res);
		return;
	}

	res.statusCode = proxyResponse.statusCode ?? 502;
	relayableHeaders(proxyResponse.headers).forEach(([name, value]) => res.setHeader(name, value));
	pipeline(proxyResponse, res, (error) => {
		if (error) {
			logProxyEvent({ event: 'proxy.relay_interrupted', outcome: 'failure', reason: describeError(error) });
		}
	});
};
