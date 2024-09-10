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

import { getConfig } from '@/global/config';
import { SCORE_API_DOWNLOAD_PATH } from '@/global/utils/constants';
import { css, Theme, useTheme } from '@emotion/react';
import { TableContextProvider } from '@overture-stack/arranger-components';
import {
	BamKeys,
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
	type BamKey,
} from '@overture-stack/iobio-components/packages/iobio-react-components/';
import { useEffect, useMemo, useState } from 'react';
import urlJoin from 'url-join';

import Loader from '@/components/Loader';
import { getToggleButtonStyles, type FileType } from './PageContent';

const bamFileExtension = 'BAM';
const cramFileExtension = 'CRAM';

export const BamFileExtensions = [bamFileExtension, cramFileExtension];

const ToggleButtonPanel = ({
	elementState,
	updateElements,
	theme,
}: {
	elementState: BamContext;
	updateElements: (key: BamKey, value: boolean) => void;
	theme: Theme;
}) => (
	<div
		css={css`
			display: flex;
		`}
	>
		<div
			css={css`
				display: inline-flex;
				min-width: fit-content;
				padding-top: 6px;
			`}
		>
			Show / Hide:{' '}
		</div>
		<div
			css={css`
				display: inline-flex;
				flex-wrap: wrap;
			`}
		>
			{BamKeys.map((key) => {
				const active = elementState[key];
				const toggleButtonStyles = getToggleButtonStyles(active, theme);

				return (
					<button
						css={css`
							display: inline-block;
							border: 2px solid ${theme.colors.accent};
							border-radius: 20px;
							margin: 5px;
							min-width: fit-content;
							padding: 3px 10px;
							${toggleButtonStyles}
						`}
						key={key}
						onClick={() => {
							updateElements(key, elementState[key]);
						}}
					>
						{displayNames[key]}
					</button>
				);
			})}
		</div>
	</div>
);

const baseScoreDownloadParams = {
	external: 'true',
	offset: '0',
	'User-Agent': 'unknown',
};
type ScoreDownloadParams = {
	'User-Agent': string;
	external: string;
	length: string;
	offset: string;
};

const getScoreDownloadUrls = async (type: 'file' | 'index', fileData: FileType) => {
	const { NEXT_PUBLIC_SCORE_API_URL } = getConfig();
	const length = fileData.file.size.toString();
	const object_id = fileData.id;

	const scoreDownloadParams: ScoreDownloadParams = {
		...baseScoreDownloadParams,
		length,
	};
	const urlParams = new URLSearchParams(scoreDownloadParams).toString();

	return await fetch(
		urlJoin(NEXT_PUBLIC_SCORE_API_URL, SCORE_API_DOWNLOAD_PATH, object_id, `?${urlParams}`),
		{
			headers: { accept: '*/*' },
			method: 'GET',
		},
	)
		.then(async (response) => {
			if (response.status === 500 || !response.ok) {
				throw new Error(
					`Error at getScoreDownloadUrls status: ${response.status}, ok: ${response.ok}`,
				);
			}

			const res = await response.json();
			return res;
		})
		.catch((error) => {
			console.error(`Error at getScoreDownloadUrls with object_id ${object_id}`, error);
		});
};

const getFileMetaData = async (selectedBamFile: FileType) => {
	const fileMetaData = await getScoreDownloadUrls('file', selectedBamFile);
	console.log('fileMetaData', fileMetaData);
	const fileUrl = fileMetaData ? fileMetaData.parts[0].url : null;
	return fileUrl;
};

const BamTable = ({ file }: { file: FileType | null }) => {
	const theme = useTheme();
	const [fileUrl, setFileUrl] = useState('');
	const [elementState, toggleElementState] = useState(initElementState);
	const [loading, setLoading] = useState(true);

	console.log('fileUrl', fileUrl);
	// TODO: This will be replaced by File data found in Arranger and passed down through context / parent components
	// const fileUrl = 'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam';
	const fileName = fileUrl.split('/').pop();
	console.log('fileUrl', fileName);

	useEffect(() => {
		if (!fileUrl && file) {
			// setLoading(true);
			console.log('condition');
			getFileMetaData(file).then((data) => {
				if (typeof data === 'string') {
					console.log('.then');
					setFileUrl(data);
					setLoading(false);
				}
			});
		} else {
			console.error('Null File Object');
		}
	}, []);

	const updateElements = (key: keyof BamContext, value: boolean) => {
		const newState = {
			...elementState,
			[key]: !value,
		};
		toggleElementState(newState);
	};

	return useMemo(
		() => (
			<TableContextProvider>
				<h2>{fileName}</h2>
				<IobioDataBroker alignmentUrl={fileUrl} />
				{loading ? (
					<Loader />
				) : (
					<>
						<ToggleButtonPanel
							elementState={elementState}
							updateElements={updateElements}
							theme={theme}
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
												<IobioPercentBox
													label={displayNames[key]}
													percentKey={key}
													totalKey="total_reads"
												/>
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
												<IobioHistogram
													brokerKey={key}
													ignoreOutliers={isOutlierKey(key)}
													label={displayNames[key]}
												/>
											</div>
										),
								)}
							</div>
						</div>
					</>
				)}
			</TableContextProvider>
		),
		[loading, elementState],
	);
};

export default BamTable;
