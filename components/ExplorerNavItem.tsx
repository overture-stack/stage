/*
 *
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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

import { useEffect, useRef, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

import defaultTheme from './theme';
import { ChevronDown } from './theme/icons';
import { InternalLink as Link } from './Link';
import useArrangerCatalogues from '@/global/hooks/useArrangerCatalogues';
import { EXPLORER_PATH } from '../global/utils/constants';

const StyledListLink = styled('a')`
	${({ theme }: { theme: typeof defaultTheme }) => css`
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
    white-space: nowrap;
    &:hover {
      background-color: ${theme.colors.grey_1};
    }
  `}
`;

/**
 * The navbar's "Data Explorer" slot: a plain link when Arranger has one catalogue to offer,
 * a dropdown of named catalogues (autopopulated from `useArrangerCatalogues`) when it has more
 * than one. Each dropdown item links straight to `/explorer?catalogue=<id>`, so choosing one is
 * a normal navigation, not extra client state.
 */
const ExplorerNavItem = () => {
	const { catalogues } = useArrangerCatalogues();
	const [open, setOpen] = useState(false);
	const node: any = useRef();
	const router = useRouter();
	const theme: typeof defaultTheme = useTheme();

	const isOnExplorer = router.pathname === EXPLORER_PATH;
	const activeLinkStyle = `
    background-color: ${theme.colors.grey_2};
    color: ${theme.colors.accent2_dark};
  `;

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

	if (catalogues.length <= 1) {
		return (
			<Link path={EXPLORER_PATH}>
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
						${isOnExplorer ? activeLinkStyle : ''}
					`}
				>
					Data Explorer
				</a>
			</Link>
		);
	}

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
				${isOnExplorer ? activeLinkStyle : ''}
			`}
			onClick={() => setOpen(!open)}
		>
			Data Explorer
			<ChevronDown
				fill={theme.colors.accent_dark}
				width={12}
				height={12}
				style={css`
					margin-left: 6px;
					${open
						? css`
								transform: rotate(180deg) translateY(-2px);
							`
						: css`
								transform: translateY(1px);
							`}
				`}
			/>
			{open && (
				<ul
					css={css`
						min-width: 180px;
						list-style: none;
						padding: 0;
						position: absolute;
						top: ${theme.dimensions.navbar.height}px;
						left: 0;
						margin: 0;
						z-index: 20;
					`}
				>
					{catalogues.map(({ catalogueId, description }) => (
						<li key={catalogueId}>
							<Link path={`${EXPLORER_PATH}?catalogue=${catalogueId}`}>
								<StyledListLink>{description ?? catalogueId}</StyledListLink>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default ExplorerNavItem;
