import { AUTH_PROVIDER, SESSION_ENDED } from './constants';
import { sessionAction, userFromSession } from './sessionState';
import { ProviderType } from '../types';

describe('sessionAction', () => {
	const settled = { hasEnded: false, isPublicPage: false, isUsable: true, status: 'authenticated' as const };

	it('does nothing while the session is still being read', () => {
		expect(sessionAction({ ...settled, isUsable: false, status: 'loading' })).toBe('none');
	});

	it('signs out when the session has ended, on a public page too', () => {
		expect(sessionAction({ ...settled, hasEnded: true, isPublicPage: true })).toBe('sign-out');
	});

	it('sends a protected page to sign-in when there is no usable session', () => {
		expect(sessionAction({ ...settled, isUsable: false, status: 'unauthenticated' })).toBe('redirect-to-login');
	});

	it('leaves a public page alone when there is no session', () => {
		expect(sessionAction({ ...settled, isPublicPage: true, isUsable: false, status: 'unauthenticated' })).toBe('none');
	});

	it('does nothing for a usable session', () => {
		expect(sessionAction(settled)).toBe('none');
	});
});

describe('userFromSession', () => {
	const keycloakSession = {
		account: { provider: AUTH_PROVIDER.KEYCLOAK },
		expires: 'later',
		user: { email: 'ada@example.org', firstName: 'Ada', id: 'user-1', lastName: 'Lovelace' },
	};

	it('describes the signed-in person for an active Keycloak session', () => {
		expect(userFromSession(AUTH_PROVIDER.KEYCLOAK, keycloakSession)).toMatchObject({
			email: 'ada@example.org',
			firstName: 'Ada',
			id: 'user-1',
			lastName: 'Lovelace',
			providerType: ProviderType.KEYCLOAK,
		});
	});

	it('describes nobody once the Keycloak session has ended', () => {
		expect(userFromSession(AUTH_PROVIDER.KEYCLOAK, { ...keycloakSession, error: SESSION_ENDED })).toBeUndefined();
	});

	it('describes nobody when there is no session', () => {
		expect(userFromSession(AUTH_PROVIDER.KEYCLOAK, null)).toBeUndefined();
		expect(userFromSession(AUTH_PROVIDER.EGO, null)).toBeUndefined();
	});

	it("describes an EGO session's user with its scopes", () => {
		const egoSession = { scopes: ['PROGRAM.READ'], user: { email: 'ada@example.org', id: 'user-1' } };

		expect(userFromSession(AUTH_PROVIDER.EGO, egoSession)).toEqual({
			email: 'ada@example.org',
			id: 'user-1',
			scope: ['PROGRAM.READ'],
		});
	});
});
