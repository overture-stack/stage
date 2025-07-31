/*
 *
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
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

import { css, Theme, useTheme } from '@emotion/react';
import { useRouter } from 'next/router';

import { InternalLink } from '@/components/Link';
import defaultTheme from '@/components/theme';

type NavbarLinkProps = {
	path: string;
	label: string;
};

const getContainerStyles = (theme: typeof defaultTheme) => css`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 144px;
	background-color: ${theme.colors.white};
	height: 100%;
	&:hover {
		background-color: ${theme.colors.grey_2};
	}
	border-right: 2px solid ${theme.colors.white};
`;

const getLinkStyles = (theme: Theme, isActive: boolean) => css`
	display: flex;
	flex: 1;
	height: 100%;
	justify-content: center;
	align-items: center;
	text-decoration: none;
	color: ${theme.colors.accent_dark};
	cursor: pointer;
	${isActive
		? `
		background-color: ${theme.colors.grey_2};
		color: ${theme.colors.accent2_dark};
	`
		: ''}
`;

/**
 *  @param {NavbarLinkProps} props - The properties for the NavbarLinkButton component.
 *  @param {string} props.path - The path for the link.
 *  @param {string} props.label - The label for the link.
 *  @return JSX.Element - A styled link button for the navigation bar.
 */
const NavbarLinkButton = ({ path, label }: NavbarLinkProps) => {
	const router = useRouter();
	const theme: typeof defaultTheme = useTheme();
	const isActive = router.pathname === path;

	return (
		<div css={getContainerStyles(theme)}>
			<InternalLink path={path}>
				<a css={getLinkStyles(theme, isActive)}>{label}</a>
			</InternalLink>
		</div>
	);
};

export default NavbarLinkButton;
