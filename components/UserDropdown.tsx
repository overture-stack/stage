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

import { useEffect, useState, useRef } from 'react';
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { signOut } from 'next-auth/react';

import { Avatar, ChevronDown } from './theme/icons';
import useAuthContext from '../global/hooks/useAuthContext';
import { UserWithId } from '../global/types/types';
import { InternalLink as Link } from './Link';
import { useRouter } from 'next/router';
import { AUTH_PROVIDER, USER_PATH } from '../global/utils/constants';
import { getConfig } from '@/global/config';

const getDisplayName = (user?: UserWithId) => {
	const greeting = 'Hello';
	if (user) {
		if (user.firstName) {
			return `${greeting}, ${user.firstName}`;
		} else if (user.lastName) {
			return `${greeting}, ${user.lastName}`;
		} else if (user.email) {
			return `${greeting}, ${user.email}`;
		}
	}
	return greeting;
};

const CurrentUser = () => {
	const { user } = useAuthContext();
	return (
		<div
			css={css`
				display: flex;
				align-items: center;
				justify-content: center;
			`}
		>
			<span
				css={css`
					padding-left: 5px;
					padding-right: 5px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					max-width: 142px;
				`}
			>
				{getDisplayName(user)}
			</span>
		</div>
	);
};

const StyledListLink = styled('a')`
	${({ theme }) => css`
		text-decoration: none;
		height: 40px;
		display: flex;
		align-items: center;
		background: ${theme.colors.white};
		padding: 6px 12px;
		color: ${theme.colors.black};
		background-color: ${theme.colors.white};
		border: 1px solid ${theme.colors.grey_3};
		outline: none;
		font-size: 16px;
		cursor: pointer;
		width: 100%;
		&:hover {
			background-color: ${theme.colors.grey_1};
		}
	`}
`;

const UserDropdown = () => {
	const [open, setOpen] = useState(false);
	const node: any = useRef();
	const router = useRouter();
	const theme = useTheme();
	const { NEXT_PUBLIC_AUTH_PROVIDER } = getConfig();

	const handleClickOutside = (e: any) => {
		if (node.current.contains(e.target)) {
			return;
		}
		setOpen(false);
	};

	useEffect(() => {
		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open]);

	const fillColor = router.pathname === USER_PATH ? theme.colors.accent2_dark : theme.colors.accent_dark;

	const handleLogout = () => {
		if (NEXT_PUBLIC_AUTH_PROVIDER === AUTH_PROVIDER.EGO || NEXT_PUBLIC_AUTH_PROVIDER === AUTH_PROVIDER.KEYCLOAK) {
			signOut();
		}
	};

	return (
		<div
			ref={node}
			css={css`
				position: relative;
				display: flex;
				height: 100%;
				width: 100%;
				align-items: center;
				justify-content: center;
				cursor: pointer;
			`}
			onClick={() => setOpen(!open)}
		>
			<Avatar
				fill={fillColor}
				width={16}
				height={16}
				style={css`
					padding-left: 4px;
				`}
			/>

			<CurrentUser />
			{open ? (
				<ChevronDown
					fill={fillColor}
					width={12}
					height={12}
					style={css`
						transform: rotate(180deg) translateY(-2px);
					`}
				/>
			) : (
				<ChevronDown
					fill={fillColor}
					width={12}
					height={12}
					style={css`
						transform: translateY(1px);
					`}
				/>
			)}
			{open && (
				<ul
					css={css`
						width: 100%;
						list-style: none;
						padding: 0;
						position: absolute;
						top: ${theme.dimensions.navbar.height}px;
						left: 0;
						margin: 0;
					`}
				>
					<li>
						<Link path={USER_PATH}>
							<StyledListLink>Profile & Token</StyledListLink>
						</Link>
					</li>
					<li>
						<StyledListLink onClick={handleLogout}>Logout</StyledListLink>
					</li>
				</ul>
			)}
		</div>
	);
};

export default UserDropdown;
