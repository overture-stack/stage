import { signOut } from 'next-auth/react';

import getInternalLink from './getInternalLink';
import { LOGIN_PATH, SESSION_ENDED_HEADER } from './constants';

/**
 * Signs out, returning to sign-in with the session marked expired, when the protected proxy's own answer says the
 * session has ended. Any other answer, an upstream's own 401 included, leaves the session alone.
 */
export const signOutIfSessionEnded = async (response: Response): Promise<void> => {
	if (response.status === 401 && response.headers.get(SESSION_ENDED_HEADER) === 'ended') {
		await signOut({ callbackUrl: `${getInternalLink({ path: LOGIN_PATH })}?session_expired=true` });
	}
};
