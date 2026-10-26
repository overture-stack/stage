/*
 *
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *   If not, see <http://www.gnu.org/licenses/>.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 *  SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 *  OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 *  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import Root from '../components/Root';
import { AppContext } from 'next/app';
import { SessionProvider, signOut, useSession } from 'next-auth/react';

import { AUTH_PROVIDER, LOGIN_PATH, SESSION_ENDED } from '../global/utils/constants';
import { PageWithConfig } from '../global/utils/pages/types';
import { useEffect } from 'react';
import Router from 'next/router';
import getInternalLink from '../global/utils/getInternalLink';
import { isValidJwt } from '../global/utils/egoTokenUtils';
import { getConfig } from '../global/config';
import { decryptContent } from '@/global/utils/crypt';
import { readPageSession } from '@/global/utils/readPageSession';
import { sessionAction } from '@/global/utils/sessionState';

const isSessionUsable = (authProvider: string, session: any): boolean => {
	if (authProvider === AUTH_PROVIDER.EGO) {
		return Boolean(session) && isValidJwt(decryptContent(session?.account?.accessToken));
	}
	if (authProvider === AUTH_PROVIDER.KEYCLOAK) {
		return Boolean(session);
	}
	return true;
};

// Follows NextAuth's live session, which changes when another tab signs out and when the tab regains focus,
// rather than the session read when the page loaded.
const SessionGuard = ({ isPublicPage }: { isPublicPage: boolean }) => {
	const { data: session, status } = useSession();
	const { NEXT_PUBLIC_AUTH_PROVIDER } = getConfig();

	useEffect(() => {
		const action = sessionAction({
			hasEnded: session?.error === SESSION_ENDED,
			isPublicPage,
			isUsable: isSessionUsable(NEXT_PUBLIC_AUTH_PROVIDER, session),
			status,
		});
		if (action === 'sign-out') {
			signOut({ callbackUrl: `${getInternalLink({ path: LOGIN_PATH })}?session_expired=true` });
		}
		if (action === 'redirect-to-login') {
			Router.push({
				pathname: getInternalLink({ path: LOGIN_PATH }),
				query: { session_expired: true },
			});
		}
	}, [isPublicPage, NEXT_PUBLIC_AUTH_PROVIDER, session, status]);

	return null;
};

const DMSApp = ({
	Component,
	pageProps,
	ctx,
	session,
}: {
	Component: PageWithConfig;
	pageProps: { [k: string]: any };
	ctx: any;
	session: any;
}) => {
	return (
		// No refetchInterval: every session read extends the session's idle limit, so a timed re-read would keep an
		// unattended tab's session alive until Keycloak's maximum. Tabs update on focus, navigation and sign-out instead.
		<SessionProvider session={session}>
			<SessionGuard isPublicPage={Boolean(Component.isPublic)} />
			<Root pageContext={ctx}>
				<Component {...pageProps} />
			</Root>
		</SessionProvider>
	);
};

DMSApp.getInitialProps = async ({ ctx, Component }: AppContext & { Component: PageWithConfig }) => {
	const pageProps = await Component.getInitialProps({ ...ctx });
	const session = await readPageSession(ctx);
	return {
		ctx: {
			pathname: ctx.pathname,
			query: ctx.query,
			asPath: ctx.asPath,
		},
		pageProps,
		session,
	};
};

export default DMSApp;
