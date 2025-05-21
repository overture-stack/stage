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

import { css, useTheme } from '@emotion/react';
import { useRouter } from 'next/router';
import { InternalLink as Link } from './Link';
import defaultTheme from './theme';

type NavbarLinkProps = {
	path: string;
	label: string;
};

const NavbarLinkButton: React.FC<NavbarLinkProps> = ({ path, label }) => {
	const router = useRouter();
	const theme: typeof defaultTheme = useTheme();
	const activeLinkStyle = `
    background-color: ${theme.colors.grey_2};
    color: ${theme.colors.accent2_dark};
	`;
	return (
		<div
			css={(theme) => css`
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
			`}
		>
			<Link path={path}>
				<a
					css={(theme) => css`
						display: flex;
						flex: 1;
						height: 100%;
						justify-content: center;
						align-items: center;
						text-decoration: none;
						color: ${theme.colors.accent_dark};
						cursor: pointer;
						${router.pathname === path ? activeLinkStyle : ''}
					`}
				>
					{label}
				</a>
			</Link>
		</div>
	);
};

export default NavbarLinkButton;
