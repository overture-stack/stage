/*
 *
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { createRef, ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';
import { useRouter } from 'next/router';
import cx from 'classnames';

import { INTERNAL_PATHS, ROOT_PATH } from '../../global/utils/constants';
import StyledLink, { InternalLink } from '../Link';
import defaultTheme from '../theme';

import Dropdown from './Dropdown';
import { linkStyles, StyledListLink } from './styles';

/**
 * Portal ref of navBar. There is only one navBar in entire pagelayout.
 */
export const navBarRef = createRef<HTMLDivElement>();

const NavBar = (): ReactElement => {
	const router = useRouter();
	const theme: typeof defaultTheme = useTheme();

	return (
		<div
			ref={navBarRef}
			css={css`
				display: flex;
				justify-content: flex-start;
				height: ${theme.dimensions.navbar.height}px;
				background: ${theme.colors.black};
				background-size: 281px;
				${theme.shadow.default};
				position: sticky;
				top: 0;
				left: 0;
				z-index: 1;
				width: 100%;
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					margin-left: 50px;
					margin-right: 70px;
					cursor: pointer;
				`}
			>
				<InternalLink path={ROOT_PATH}>
					<a
						css={css`
							display: flex;
							align-items: center;
							text-decoration: none;
						`}
					>
						<img src="/images/navbar-logo.png" alt="Navbar logo" width="45" />
					</a>
				</InternalLink>
			</div>
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						height: 100%;
						width: 100%;
					`}
				>
					<Dropdown
						css={linkStyles}
						data={[
							<InternalLink path={INTERNAL_PATHS.EXPLORER}>
								<StyledListLink className={cx({ active: router.asPath.startsWith(INTERNAL_PATHS.EXPLORER) })}>
									Correlation Data
								</StyledListLink>
							</InternalLink>,
							<InternalLink path={INTERNAL_PATHS.MUTATION}>
								<StyledListLink className={cx({ active: router.asPath.startsWith(INTERNAL_PATHS.MUTATION) })}>
									Mutation Data
								</StyledListLink>
							</InternalLink>,
						]}
						label="Explore The Data"
						urls={[INTERNAL_PATHS.MUTATION]}
					/>

					<InternalLink path={INTERNAL_PATHS.ABOUT}>
						<StyledLink
							css={css`
								${linkStyles(theme)}/* Add any additional styles from Dropdown if needed */
							`}
							className={cx({ active: router.asPath.startsWith(INTERNAL_PATHS.ABOUT) })}
						>
							About
						</StyledLink>
					</InternalLink>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
