import NextAuth from 'next-auth';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			sub: string;
			name: string;
			email: string;
			firstName: string;
			lastName: string;
			emailVerified: string;
		};
		expires: string;
		account: {
			provider: string;
			/** EGO sessions only. A Keycloak session's tokens stay on the server-side session token. */
			accessToken?: string;
		};
		/** Set when the session has ended because Keycloak refused to renew it. */
		error?: string;
		/** EGO sessions only. */
		scopes?: string[];
	}
}
