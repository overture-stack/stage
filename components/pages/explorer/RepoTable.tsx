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

import { css, useTheme } from '@emotion/react';
import {
	CountDisplay,
	MaxRowsSelector,
	PageSelector,
	Table,
	useArrangerTheme,
} from '@overture-stack/arranger-components';
import { UseThemeContextProps } from '@overture-stack/arranger-components/dist/ThemeContext/types';
import { useMemo } from 'react';
import { DMSThemeInterface } from '@/components/theme';

const getTableConfigs = ({ theme }: { theme: DMSThemeInterface }): UseThemeContextProps => ({
	callerName: 'RepoTable',
	components: {
		Table: {
			// functionality
			hideLoader: true,

			// appearance
			background: theme.colors.white,
			borderColor: theme.colors.grey_3,
			css: css`
				${theme.shadow.default}
			`,

			// Child components
			CountDisplay: {
				// Table CountDisplay is hidden in order to position CountDisplay with Pagination
				fontSize: '0px',
			},
			HeaderRow: {
				borderColor: theme.colors.grey_3,
				css: css`
					${theme.typography.data}
				`,
				fontColor: theme.colors.accent_dark,
				fontSize: '13px',
				fontWeight: 'bold',
				lineHeight: '1.7rem',
			},
			MaxRowsSelector: {
				fontColor: 'inherit',
			},
			Row: {
				css: css`
					&:nth-of-type(2n-1) {
						background-color: ${theme.colors.grey_1};
					}
				`,
				hoverBackground: theme.colors.grey_highlight,
				lineHeight: '1.5rem',
				selectedBackground: 'pink',
				verticalBorderColor: theme.colors.grey_3,
			},
			TableWrapper: {
				margin: '0.5rem 0',
			},
		},
	},
});

const RepoTable = () => {
	const theme = useTheme();

	const tableConfig = getTableConfigs({
		theme,
	});

	useArrangerTheme(tableConfig);

	return useMemo(
		() => (
			<>
				<Table />
				<div
					css={css`
						display: flex;
					`}
				>
					<MaxRowsSelector
						css={css`
							margin-left: 0.3rem;

							.Spinner {
								justify-content: space-between;
								width: 65%;
							}
						`}
					/>
					<CountDisplay
						css={css`
							margin-left: 2rem;
						`}
						theme={{
							fontColor: theme.colors.black,
							fontSize: '0.8rem',
						}}
					/>
					<PageSelector
						theme={{
							fontColor: theme.colors.black,
						}}
					/>
				</div>
			</>
		),
		[],
	);
};

export default RepoTable;
