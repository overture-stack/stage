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

import { css, Theme, useTheme } from '@emotion/react';
import { useArrangerData } from '@overture-stack/arranger-components';
import { SQONType } from '@overture-stack/arranger-components/dist/DataContext/types.js';
import { TableContextInterface } from '@overture-stack/arranger-components/dist/Table/types';
import stringify from 'fast-json-stable-stringify';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import useUrlParamState from '@/global/hooks/useUrlParamsState';
import { File, Screen } from '../../theme/icons';

import BamTable from './BamTable';
import Facets from './Facets';
import QueryBar from './QueryBar';
import RepoTable from './RepoTable';

const tableTypes = {
	REPO_TABLE: 'repoTable',
	BAM_TABLE: 'bamTable',
};

export const getToggleButtonStyles = (active: boolean, theme: Theme) =>
	active
		? `
			background-color: ${theme.colors.white};
			color: ${theme.colors.accent};
		`
		: `
			background-color: ${theme.colors.accent};
			color: ${theme.colors.white};
		`;

const PageContent = ({ tableContext }: { tableContext: TableContextInterface }) => {
	const theme = useTheme();
	const [showSidebar, setShowSidebar] = useState(true);
	const [tableType, setTableType] = useState(tableTypes['REPO_TABLE']);
	const { selectedRows } = tableContext;

	const sidebarWidth = showSidebar ? theme.dimensions.facets.width : 0;

	// TODO: abstract this param handling into an Arranger integration.
	const arrangerData = useArrangerData({ callerName: 'Explorer-PageContent' });
	const { sqon, setSQON } = arrangerData;
	const [firstRender, setFirstRender] = useState<boolean>(true);
	const [currentFilters, setCurrentFilters] = useUrlParamState<SQONType | null>('filters', null, {
		prepare: (v) => v.replace('"field"', '"fieldName"'),
		deSerialize: (v) => {
			return v ? JSON.parse(v) : null;
		},
		serialize: (v) => (v ? stringify(v) : ''),
	});

	useEffect(() => {
		if (firstRender) {
			currentFilters && setSQON(currentFilters);
			setFirstRender(false);
		}
	}, [currentFilters, firstRender, setSQON]);

	useEffect(() => {
		firstRender || isEqual(sqon, currentFilters) || setCurrentFilters(sqon);
	}, [currentFilters, firstRender, setCurrentFilters, sqon]);

	const isFileTableActive = tableType === tableTypes['REPO_TABLE'];

	const switchTable = () => {
		const nextTableValue = isFileTableActive ? tableTypes['BAM_TABLE'] : tableTypes['REPO_TABLE'];
		setTableType(nextTableValue);
	};

	const iconColor = isFileTableActive ? theme.colors.accent : theme.colors.white;

	return useMemo(
		() => (
			<div
				css={css`
					flex: 1;
					width: 100vw;
				`}
			>
				<div
					css={css`
						display: flex;
						flex-direction: row;
						margin-left: 0;
					`}
				>
					{/* WIP button to hide/show the sidebar
					<button
						css={css`
						position: absolute;
						top: 5px;
						`}
						onClick={() => setShowSidebar(!showSidebar)}
					>
						Show
					</button> */}

					<aside
						css={css`
							flex: 0 0 ${sidebarWidth}px;
							flex-direction: column;
							background-color: ${theme.colors.white};
							z-index: 1;
							${theme.shadow.right};
							height: calc(
								100vh - ${theme.dimensions.footer.height + theme.dimensions.navbar.height}px
							);
							overflow-y: scroll;
						`}
					>
						<Facets />
					</aside>
					<div
						css={css`
							display: flex;
							flex-direction: column;
							width: 100%;
							height: calc(
								100vh - ${theme.dimensions.footer.height + theme.dimensions.navbar.height}px
							);
							overflow-y: scroll;
						`}
					>
						<div
							css={css`
								flex: 8.5;
								margin: 0 15px 0 15px;
								max-width: calc(100vw - ${sidebarWidth + 10}px);
							`}
						>
							<QueryBar />

							<article
								css={css`
									background-color: ${theme.colors.white};
									border-radius: 5px;
									margin-bottom: 12px;
									padding: 8px;
									${theme.shadow.default};
								`}
							>
								<div
									css={css`
										margin-bottom: 8px;
									`}
								>
									<button
										css={css`
											border: 2px solid ${theme.colors.accent};
											border-radius: 5px;
											padding: 6px;
											${getToggleButtonStyles(isFileTableActive, theme)}
										`}
										onClick={switchTable}
									>
										{isFileTableActive ? (
											<span>
												<File
													fill={iconColor}
													style={css`
														vertical-align: middle;
													`}
												/>{' '}
												Files
											</span>
										) : (
											<span>
												<Screen
													fill={iconColor}
													style={css`
														vertical-align: middle;
													`}
												/>{' '}
												Visualization
											</span>
										)}
									</button>
								</div>
								{isFileTableActive ? <RepoTable /> : <BamTable />}
							</article>
						</div>
					</div>
				</div>
			</div>
		),
		[tableType],
	);
};

export default PageContent;
