import { signOut } from 'next-auth/react';

import { signOutIfSessionEnded } from './signOutIfSessionEnded';

jest.mock('next-auth/react', () => ({ signOut: jest.fn() }));

const mockedSignOut = signOut as jest.MockedFunction<typeof signOut>;

const proxyAnswer = (status: number, body: unknown, headers: Record<string, string> = {}) =>
	({
		clone: () => ({ json: async () => body }),
		headers: { get: (name: string) => headers[name.toLowerCase()] ?? null },
		status,
	}) as unknown as Response;

const STAGE_SESSION_ENDED = { 'x-stage-session': 'ended' };

beforeEach(() => {
	jest.clearAllMocks();
});

describe('signOutIfSessionEnded', () => {
	it("signs out, returning to sign-in with the session marked expired, when the proxy says the session ended", async () => {
		await signOutIfSessionEnded(proxyAnswer(401, { error: 'session_ended' }, STAGE_SESSION_ENDED));

		expect(mockedSignOut).toHaveBeenCalledWith({ callbackUrl: expect.stringMatching(/\/login\?session_expired=true$/) });
	});

	it("leaves the session alone for an upstream's own 401", async () => {
		await signOutIfSessionEnded(proxyAnswer(401, { message: 'Unauthorized' }));

		expect(mockedSignOut).not.toHaveBeenCalled();
	});

	it("leaves the session alone for an upstream 401 whose body resembles Stage's answer", async () => {
		await signOutIfSessionEnded(proxyAnswer(401, { error: 'session_ended' }));

		expect(mockedSignOut).not.toHaveBeenCalled();
	});

	it('leaves the session alone for any other failure', async () => {
		await signOutIfSessionEnded(proxyAnswer(503, { error: 'identity_provider_unavailable' }));

		expect(mockedSignOut).not.toHaveBeenCalled();
	});
});
