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
import { useEffect, useState } from 'react';

import Loader from '@/components/Loader';
import { DemoDataButton, demoFileMetadata } from './DemoData';
import { FileMetaData, FileTableData } from './fileTypes';
import { getFileMetaData, isFileMetaData } from './fileUtils';
import { getToggleButtonStyles } from './getButtonStyles';

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

const BamTable = ({ file }: { file: FileTableData | undefined }) => {
	const theme = useTheme();
	const [fileMetaData, setFileMetaData] = useState<FileMetaData | undefined>(undefined);
	const [elementState, setElementState] = useState(initElementState);
	const [loading, setLoading] = useState(true);

	const fileUrl = fileMetaData?.parts[0]?.url || null;

	// Todo: Update fileName definition
	const fileName = file?.id || fileUrl?.split('/').pop()?.split('?')[0];

	const loadAndSetFile = async (file: FileTableData) => {
		// TODO: Add Client Error Handling
		const data = await getFileMetaData(file);

		if (isFileMetaData(data)) {
			setFileMetaData(data);
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

	/* TODO: Remove Demo Data logic */
	const isDemoData = fileMetaData?.objectId === demoFileMetadata.objectId;

	const loadDemoFile = async () => {
		setLoading(true);
		if (isDemoData && file) {
			await loadAndSetFile(file);
		} else {
			setFileMetaData(demoFileMetadata);
		}
	};

	useEffect(() => {
		if (!fileUrl && file) {
			// On page load, file table data is populated,
			// but original file url needs to be requested from Score to use for Iobio analysis
			loadAndSetFile(file);
		} else if (file === null) {
			// TODO: Add Client Error Handling
			console.error('No File Data');
		} else if (isDemoData && loading) {
			// TODO: Remove Demo Hook
			setLoading(false);
		}
	}, [fileUrl, file]);

	return (
		<TableContextProvider>
			{/* TODO: Remove Demo Data Button */}
			<DemoDataButton loadDemoFile={loadDemoFile} isDemoData={isDemoData} theme={theme} />
			<h2>{fileName}</h2>
			{loading || !fileUrl ? (
				<Loader />
			) : (
				<>
					<IobioDataBroker alignmentUrl={fileUrl} />
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
	);
};

export default BamTable;
