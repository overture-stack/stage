import { ProviderType, UserStatus, UserType, UserWithId } from '../types';
import { AUTH_PROVIDER, SESSION_ENDED } from './constants';

/** What a page does about its session: nothing, send a protected page to sign-in, or sign out an ended session. */
export type SessionAction = 'none' | 'redirect-to-login' | 'sign-out';

/**
 * Decides what a page does about its live session. An ended session is signed out on any page, so its cookie is
 * cleared; a protected page without a usable session goes to sign-in; nothing happens while the session is read.
 */
export const sessionAction = ({
	hasEnded,
	isPublicPage,
	isUsable,
	status,
}: {
	hasEnded: boolean;
	isPublicPage: boolean;
	isUsable: boolean;
	status: 'authenticated' | 'loading' | 'unauthenticated';
}): SessionAction => {
	if (status === 'loading') {
		return 'none';
	}
	if (hasEnded) {
		return 'sign-out';
	}
	return isUsable || isPublicPage ? 'none' : 'redirect-to-login';
};

/** The signed-in person shown by the page, or nobody when there is no session or a Keycloak session has ended. */
export const userFromSession = (authProvider: string, session: any): UserWithId | undefined => {
	const isKeycloakSessionActive = Boolean(session?.account) && session?.error !== SESSION_ENDED;
	if (authProvider === AUTH_PROVIDER.KEYCLOAK && isKeycloakSessionActive) {
		return {
			createdAt: 0,
			email: session.user?.email,
			firstName: session.user?.firstName,
			id: session.user?.id,
			lastLogin: 0,
			lastName: session.user?.lastName,
			providerSubjectId: '',
			providerType: ProviderType.KEYCLOAK,
			scope: session.scopes,
			status: UserStatus.APPROVED,
			type: UserType.USER,
		};
	}
	if (authProvider === AUTH_PROVIDER.EGO && session?.user) {
		return { ...session.user, scope: session.scopes };
	}
	return undefined;
};
