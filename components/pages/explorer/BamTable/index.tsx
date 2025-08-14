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
	histogramKeys,
	defaultBamContext as initElementState,
	getBedUrlForEsDocument,
	IobioCoverageDepth,
	IobioDataBroker,
	IobioHistogram,
	IobioPercentBox,
	isOutlierKey,
	getFileMetadata,
	percentKeys,
	IobioLabelInfoButton,
	IobioPanel,
	fileMetaDataSchema,
	type BamContext,
	type BamPercentKey,
	type BamHistogramKey,
	type FileDocument,
	type FileMetaData,
	type ScoreConfig,
} from '@overture-stack/iobio-components/packages/iobio-react-components/';
import { useArrangerData } from '@overture-stack/arranger-components';
import { useEffect, useState } from 'react';

import Loader from '@/components/Loader';
import { getConfig } from '@/global/config';
import { SCORE_API_DOWNLOAD_PATH } from '@/global/utils/constants';
import { type FileTableData, isFileResponse } from '../fileTypes';
import { IobioFileQuery } from './tableUtils';
import { ToggleButtonPanel } from './ToggleButtonPanel';
import { StatsTable } from './StatsTable';

const BamTable = ({ file }: { file?: FileTableData }) => {
	const { apiFetcher } = useArrangerData({ callerName: 'GetindexFile' });
	const theme = useTheme();
	const [elementState, setElementState] = useState(initElementState);
	const [indexFileData, setIndexFileData] = useState<FileMetaData | undefined>(undefined);
	const [fileMetaData, setFileMetaData] = useState<FileMetaData | undefined>(undefined);
	const [bedUrl, setBedUrl] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState(true);

	const { NEXT_PUBLIC_IOBIO_API_URL, NEXT_PUBLIC_SCORE_API_URL } = getConfig();
	const fileUrl = fileMetaData?.parts[0]?.url || null;
	const fileId = file?.id || fileUrl?.split('/').pop()?.split('?')[0];
	const fileFormat = file?.file_type;
	const indexFileUrl = indexFileData?.parts[0]?.url || null;

	const updateElements = (key: keyof BamContext, value: boolean) => {
		const newState = {
			...elementState,
			[key]: !value,
		};
		setElementState(newState);
	};

	useEffect(() => {
		if (!fileUrl && file) {
			const loadAndSetFile = async () => {
				const iobioFileResponse = await apiFetcher({
					endpointTag: 'GetIobioFileData',
					body: {
						query: IobioFileQuery,
						variables: {
							first: 1,
							sqon: {
								content: [{ op: 'in', content: { fieldName: '_id', value: fileId } }],
								op: 'and',
							},
						},
					},
				});

				if (isFileResponse(iobioFileResponse)) {
					const fileDocument: FileDocument = iobioFileResponse.data.file.hits.edges[0].node;
					const scoreConfig: ScoreConfig = {
						scoreApiUrl: NEXT_PUBLIC_SCORE_API_URL,
						scoreApiDownloadPath: SCORE_API_DOWNLOAD_PATH,
					};
					const { scoreFileMetadata, indexFileMetadata } = await getFileMetadata({
						selectedFile: fileDocument,
						scoreConfig,
					});
					const defaultBedUrl = getBedUrlForEsDocument(fileDocument);

					if (fileMetaDataSchema.safeParse(scoreFileMetadata).success) {
						setFileMetaData(scoreFileMetadata);
						setIndexFileData(indexFileMetadata);
						setBedUrl(defaultBedUrl);
					} else {
						setFileMetaData(undefined);
						console.error('Error retrieving Score File Data');
					}
				} else {
					setFileMetaData(undefined);
					console.error('Error retrieving Score File Data');
				}
				setLoading(false);
			};
			// On page load, file table data is populated,
			// but original file url needs to be requested from Score to use for Iobio analysis
			loadAndSetFile();
		} else if (file === null) {
			// TODO: Add Client Error Handling
			console.error('No File Data');
		}
	}, [fileUrl, file]);

	return (
		<>
			<h2>File Id: {fileId}</h2>
			<ToggleButtonPanel bamContext={elementState} onToggle={updateElements} />
			{loading || !fileUrl ? (
				<Loader />
			) : (
				<>
					<IobioDataBroker
						alignmentUrl={fileUrl}
						bedUrl={bedUrl}
						fileFormat={fileFormat}
						indexUrl={indexFileUrl}
						server={NEXT_PUBLIC_IOBIO_API_URL}
					/>
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
								(key: BamPercentKey) =>
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
											<IobioLabelInfoButton bamKey={key} />
											<IobioPercentBox percentKey={key} totalKey="total_reads" />
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
								(key: BamHistogramKey) =>
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
											<IobioPanel>
												<IobioLabelInfoButton key={key} />
												<IobioHistogram brokerKey={key} ignoreOutliers={isOutlierKey(key)} />
											</IobioPanel>
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
