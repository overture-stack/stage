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

import { css, useTheme } from '@emotion/react';
import { useArrangerData, useTableContext } from '@overture-stack/arranger-components';
import { SQONType } from '@overture-stack/arranger-components/dist/DataContext/types.js';
import { type UseTableContextProps } from '@overture-stack/arranger-components/dist/Table/types';
import stringify from 'fast-json-stable-stringify';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';

import useUrlParamState from '@/global/hooks/useUrlParamsState';

import BamTable from './BamTable/index';
import { tableTypes } from './constants';
import Facets from './Facets';
import { type FileTableData, rowIsFileData } from './fileTypes';
import QueryBar from './QueryBar';
import RepoTable from './RepoTable';
import TableHeader from './TableHeader';
import ModalContainer from './Modal';
import { VisualizerModal } from './Modal/components';

const PageContent = () => {
	const theme = useTheme();
	const [showSidebar, setShowSidebar] = useState(true);
	const sidebarWidth = showSidebar ? theme.dimensions.facets.width : 0;
	// TODO: abstract this param handling into an Arranger integration.
	const contextProps: Partial<UseTableContextProps> = {
		callerName: 'Explorer-PageContent',
	};
	const arrangerData = useArrangerData(contextProps);
	const { sqon, setSQON } = arrangerData;
	const tableContext = useTableContext(contextProps);
	const { selectedRows, tableData } = tableContext;
	const [tableType, setTableType] = useState(tableTypes['REPO_TABLE']);
	const [isModalOpen, setModalOpen] = useState(false);
	const [firstRender, setFirstRender] = useState<boolean>(true);
	const [isFullScreen, setFullscreen] = useState(Boolean(document.fullscreenElement));
	const [currentFilters, setCurrentFilters] = useUrlParamState<SQONType | null>('filters', null, {
		prepare: (v) => v.replace('"field"', '"fieldName"'),
		deSerialize: (v) => {
			return v ? JSON.parse(v) : null;
		},
		serialize: (v) => (v ? stringify(v) : ''),
	});
	const pageContentRef = useRef<HTMLElement>(null);
	// TODO: Remove 2nd condition here when adding JBrowse & cBio tables
	const isFileTableActive = tableType === tableTypes['REPO_TABLE'] || !(tableType === tableTypes['BAM_TABLE']);

	useEffect(() => {
		if (firstRender) {
			currentFilters && setSQON(currentFilters);
			setFirstRender(false);
		}
	}, [currentFilters, firstRender, setSQON]);

	useEffect(() => {
		firstRender || isEqual(sqon, currentFilters) || setCurrentFilters(sqon);
	}, [currentFilters, firstRender, setCurrentFilters, sqon]);

	const fileData = tableData.filter(rowIsFileData) as FileTableData[];
	const currentFiles = fileData.filter((row) => selectedRows.includes(row.id));

	const iconColor = isFileTableActive
		? currentFiles.length
			? theme.colors.accent
			: theme.colors.grey_4
		: theme.colors.white;

	const closeModal = () => {
		setModalOpen(false);
		setErrorMessage('');
	};

	const openModal = () => {
		setModalOpen(true);
	};

	const toggleFullScreen = () => {
		if (!isFullScreen && pageContentRef.current) {
			pageContentRef.current.requestFullscreen();
			setFullscreen(true);
		} else {
			document.exitFullscreen();
			setFullscreen(false);
		}
	};

	const [errorMessage, setErrorMessage] = useState('');

	return useMemo(
		() => (
			<div
				id={'pageContent'}
				css={css`
					flex: 1;
					width: 100vw;
				`}
			>
				<ModalContainer
					appRootId={'#pageContent'}
					closeModal={closeModal}
					isModalOpen={isModalOpen}
					errorMessage={errorMessage}
				>
					<VisualizerModal
						closeModal={closeModal}
						setTable={setTableType}
						currentFiles={currentFiles}
						setErrorMessage={setErrorMessage}
					/>
				</ModalContainer>
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
							height: calc(100vh - ${theme.dimensions.footer.height + theme.dimensions.navbar.height}px);
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
							height: calc(100vh - ${theme.dimensions.footer.height + theme.dimensions.navbar.height}px);
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
								ref={pageContentRef}
							>
								<TableHeader
									iconColor={iconColor}
									visualizersEnabled={currentFiles.length > 0}
									isFileTableActive={isFileTableActive}
									isFullScreen={isFullScreen}
									setTable={setTableType}
									openModal={openModal}
									toggleFullScreen={toggleFullScreen}
								/>
								{/* TODO: Add JBrowse & cBio Tables */}
								{isFileTableActive ? (
									<RepoTable />
								) : tableType === tableTypes.JBROWSE_TABLE ? (
									<RepoTable />
								) : tableType === tableTypes.BAM_TABLE ? (
									<BamTable file={currentFiles[0]} />
								) : (
									<RepoTable />
								)}
							</article>
						</div>
					</div>
				</div>
			</div>
		),
		[tableType, tableContext],
	);
};

export default PageContent;
