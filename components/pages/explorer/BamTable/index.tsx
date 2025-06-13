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

'use client';

import { css, useTheme } from '@emotion/react';
import {
	BamDisplayNames as displayNames,
	histogramKeys,
	defaultBamContext as initElementState,
	IobioCoverageDepth,
	IobioDataBroker,
	IobioHistogram,
	IobioPercentBox,
	isOutlierKey,
	percentKeys,
	type BamContext,
} from '@overture-stack/iobio-components/packages/iobio-react-components/';
import { useArrangerData } from '@overture-stack/arranger-components';
import { useEffect, useState } from 'react';

import Loader from '@/components/Loader';
import { FileMetaData, FileTableData } from '../fileTypes';
import { getFileMetaData, isFileMetaData, getIndexFileData } from '../fileUtils';
import { ToggleButtonPanel } from './ToggleButtonPanel';
import { StatsTable } from './StatsTable';

const BamTable = ({ file }: { file?: FileTableData }) => {
	const { apiFetcher } = useArrangerData({ callerName: 'GetIndexFileData' });
	const theme = useTheme();
	const [elementState, setElementState] = useState(initElementState);
	const [indexFileData, setIndexFileData] = useState<FileMetaData | undefined>(undefined);
	const [fileMetaData, setFileMetaData] = useState<FileMetaData | undefined>(undefined);
	const [loading, setLoading] = useState(true);

	const fileUrl = fileMetaData?.parts[0]?.url || null;
	const fileId = file?.id || fileUrl?.split('/').pop()?.split('?')[0];
	const indexFileUrl = indexFileData?.parts[0]?.url || null;

	const loadAndSetFile = async (file: FileTableData) => {
		// TODO: Add Client Error Handling
		const indexFileResponse = await getIndexFileData({ apiFetcher, fileId });
		const indexFile = indexFileResponse?.data?.file.hits.edges[0]?.node.file.index_file;

		const { fileMetaData, indexFileMetaData } = await getFileMetaData(file, indexFile);

		if (isFileMetaData(fileMetaData)) {
			setFileMetaData(fileMetaData);
			setIndexFileData(indexFileMetaData);
		} else {
			setFileMetaData(undefined);
			console.error('Error retrieving Score File Data');
		}
		setLoading(false);
	};

	const updateElements = (key: keyof BamContext, value: boolean) => {
		const newState = {
			...elementState,
			[key]: !value,
		};
		setElementState(newState);
	};

	useEffect(() => {
		if (!fileUrl && file) {
			// On page load, file table data is populated,
			// but original file url needs to be requested from Score to use for Iobio analysis
			loadAndSetFile(file);
		} else if (file === null) {
			// TODO: Add Client Error Handling
			console.error('No File Data');
		}
	}, [fileUrl, file]);
	return (
		<>
			<h2>{fileId}</h2>
			<ToggleButtonPanel bamContext={elementState} onToggle={updateElements} />
			{loading || !fileUrl ? (
				<Loader />
			) : (
				<>
					<IobioDataBroker alignmentUrl={fileUrl} indexUrl={indexFileUrl} />
					<div
						css={css`
							display: flex;
						`}
					>
						<div
							css={css`
								display: inline-flex;
								flex-direction: column;
								width: 25%;
								justify-content: flex-start;
							`}
						>
							{percentKeys.map(
								(key) =>
									elementState[key] && (
										<div
											css={css`
												height: 25vh;
												margin: 2vh;
												border: 1px solid ${theme.colors.grey_3};
												padding: 15px;
											`}
											key={key}
										>
											<IobioPercentBox label={displayNames[key]} percentKey={key} totalKey="total_reads" />
										</div>
									),
							)}
						</div>
						<div
							css={css`
								display: inline-flex;
								flex-direction: column;
								width: 75%;
							`}
						>
							{elementState['coverage_depth'] && (
								<div
									css={css`
										height: 40vh;
										margin: 2vh;
										border: 1px solid ${theme.colors.grey_3};
										padding: 15px;
									`}
								>
									<IobioCoverageDepth label="Read Coverage" />
								</div>
							)}
							{histogramKeys.map(
								(key) =>
									elementState[key] && (
										<div
											css={css`
												height: 40vh;
												margin: 2vh;
												border: 1px solid ${theme.colors.grey_3};
												padding: 15px;
											`}
											key={key}
										>
											<IobioHistogram brokerKey={key} ignoreOutliers={isOutlierKey(key)} label={displayNames[key]} />
										</div>
									),
							)}
						</div>
					</div>
				</>
			)}
			{file && <StatsTable file={file} fileId={fileId} />}
		</>
	);
};

export default BamTable;
