/*
 *
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
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

import ErrorNotification from '@/components/ErrorNotification';
import { OverlayLoader } from '@/components/Loader';
import createArrangerFetcher from '@/components/utils/arrangerFetcher';
import { getConfig } from '@/global/config';
import { SCORE_API_DOWNLOAD_PATH } from '@/global/utils/constants';
import { css, useTheme } from '@emotion/react';
import { useTableContext } from '@overture-stack/arranger-components';
import { JbrowseCircular, JbrowseLinear } from '@overture-stack/dms-jbrowse-components';
import SQON from '@overture-stack/sqon-builder';
import jsonpath from 'jsonpath';
import { find } from 'lodash';
import { useEffect, useState } from 'react';
import urlJoin from 'url-join';
import { jbrowseAssemblyObject } from './assembly';
import { jbrowseCircularDefaultSession, jbrowseLinearDefaultSession } from './defaultSession';
import JbrowseSelectedFilesTable from './JbrowseSelectedFilesTable';
import {
	JbrowseCompatibleFile,
	JbrowseInput,
	JbrowseQueryNode,
	ScoreDownloadParams,
	ScoreDownloadResult,
	TableData,
} from './types';
import useJbrowseCompatibility from './useJbrowseCompatibility';
import {
	checkJbrowseCompatibility,
	fileQuery,
	jbrowseAssemblyName,
	jbrowseErrors,
	JbrowseFileAccess,
	JbrowseFileTypes,
	JbrowseTypeName,
	JbrowseTypeNames,
} from './utils';

const {
	NEXT_PUBLIC_SCORE_API_URL,
	NEXT_PUBLIC_JBROWSE_DATA_MODEL,
	NEXT_PUBLIC_JBROWSE_NODE_QUERY,
	NEXT_PUBLIC_JBROWSE_FILE_QUERY,
} = getConfig();
const arrangerFetcher = createArrangerFetcher({});

type Filters = {
	filters: {
		first: number;
		offset: number;
		score: string;
		sort: [{ fieldName: string; order: string }];
		sqon: SQON;
	};
};

// request data for jbrowse display and
// score /download request to get signed URLs
const jbrowseInputQuery = (dataQuery: string) => `
query jbrowseInput ($filters: JSON) {
  ${dataQuery}
}
`;

const baseScoreDownloadParams = {
	external: 'true',
	offset: '0',
	'User-Agent': 'unknown',
};

const getScoreDownloadUrls = (type: 'file' | 'index', files: JbrowseCompatibleFile[]) =>
	Promise.all(
		files.map((file: JbrowseCompatibleFile) => {
			const length = file[`${type}Size`].toString();
			const object_id = file[`${type}Id`];

			const scoreDownloadParams: ScoreDownloadParams = {
				...baseScoreDownloadParams,
				length,
				object_id,
			};
			const urlParams = new URLSearchParams(scoreDownloadParams).toString();

			return fetch(
				urlJoin(NEXT_PUBLIC_SCORE_API_URL, SCORE_API_DOWNLOAD_PATH, object_id, `?${urlParams}`),
				{
					headers: { accept: '*/*' },
					method: 'GET',
				},
			).then((response) => response.json());
		}),
	);

const getUrlFromResult = (results: ScoreDownloadResult[], targetId: string) =>
	find(results, { objectId: targetId })?.parts[0].url || '';

const JbrowseEl = ({ activeJbrowseType }: { activeJbrowseType: JbrowseTypeName }) => {
	// assume 1-MAX compatible files.
	// minimum compatibility requirements are checked in JbrowseWrapper.
	const theme = useTheme();
	const { selectedRows } = useTableContext({
		callerName: 'Jbrowse - Wrapper',
	});
	const [compatibleFiles, setCompatibleFiles] = useState<JbrowseCompatibleFile[]>([]);
	const [inputFiles, setInputFiles] = useState<JbrowseInput[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');

	const handleError = (error: Error) => {
		setError(jbrowseErrors(activeJbrowseType).default);
		console.error(error);
	};

	const jBrowseCompatibilityFilter = ({
		file_access,
		file_type,
		file: { index_file },
	}: JbrowseQueryNode) =>
		checkJbrowseCompatibility({
			file_access,
			file_type,
			index_file,
			jbrowseType: activeJbrowseType,
		});

	const mapJbrowseFiles = ({
		object_id,
		file,
		file_type,
	}: JbrowseQueryNode): JbrowseCompatibleFile => ({
		fileId: object_id,
		fileName: file.name,
		fileSize: file.size,
		fileType: file_type,
		// files without an index were filtered out above.
		// falsey handling is for typescript only.
		indexId: file.index_file?.object_id || '',
		indexSize: file.index_file?.size || 0,
	});

	useEffect(() => {
		// step 1: get compatible files
		setLoading(true);

		const variables: Filters = {
			filters: {
				first: 20,
				offset: 0,
				score: '',
				sort: [{ fieldName: 'analysis_id', order: 'asc' }],
				sqon: SQON.in('object_id', selectedRows),
			},
		};
		const dataQuery = NEXT_PUBLIC_JBROWSE_DATA_MODEL || fileQuery;
		const query = jbrowseInputQuery(dataQuery);
		// fetch metadata from arranger for selected files
		arrangerFetcher({
			endpoint: 'graphql/JBrowseDataQuery',
			body: JSON.stringify({
				variables,
				query,
			}),
		})
			.then(({ data }) => {
				const nodeQuery = NEXT_PUBLIC_JBROWSE_NODE_QUERY
					? `$..${NEXT_PUBLIC_JBROWSE_NODE_QUERY}`
					: '$..edges';
				const fileQuery = NEXT_PUBLIC_JBROWSE_FILE_QUERY
					? `$..${NEXT_PUBLIC_JBROWSE_FILE_QUERY}`
					: '$..edges';

				const nodes = jsonpath.query(data, nodeQuery)[0];
				const indexFiles = jsonpath.query(nodes, fileQuery);
				const files = indexFiles
					.map((files: TableData[]) => {
						const mappedFiles = files.map((data) => {
							// Map for Compatibility
							// Based on Table Data Query
							const { object_id, name, size, fileType, file_access } = data.node;
							const jbrowseFile: JbrowseQueryNode = {
								file_type: fileType as JbrowseFileTypes,
								file_access: file_access as JbrowseFileAccess,
								object_id,
								file: {
									name,
									size,
									index_file: {
										object_id,
										size,
									},
								},
							};
							return jbrowseFile;
						});
						return mappedFiles;
					})
					.flat();

				// restructure compatible files list for jbrowse's API
				const nextJbrowseCompatibleFiles = files
					.filter(jBrowseCompatibilityFilter)
					.map(mapJbrowseFiles);

				setCompatibleFiles(nextJbrowseCompatibleFiles);
			})
			.catch((error: Error) => handleError(error));
	}, [selectedRows]);

	useEffect(() => {
		// step 2: get score signed URLs for compatible files & their indices
		const getFileURLs = getScoreDownloadUrls('file', compatibleFiles);
		const getIndexURLs = getScoreDownloadUrls('index', compatibleFiles);

		Promise.all([getFileURLs, getIndexURLs])
			.then(([fileResults, indexResults]: ScoreDownloadResult[][]) =>
				setInputFiles(
					compatibleFiles.map(({ fileId, fileName, fileType, indexId }) => ({
						fileId,
						fileName,
						fileType,
						fileURI: getUrlFromResult(fileResults, fileId),
						indexURI: getUrlFromResult(indexResults, indexId),
					})),
				),
			)
			.catch((error: Error) => handleError(error))
			// continue loading for 1 second to give jbrowse time to render.
			.finally(() => setTimeout(() => setLoading(false), 1000));
	}, [compatibleFiles]);

	const jbrowseProps = {
		assembly: jbrowseAssemblyObject,
		assemblyName: jbrowseAssemblyName,
		configuration: {
			theme: {
				elevation: 0,
				palette: { secondary: { main: theme.colors.accent } },
			},
		},
		defaultSession: jbrowseCircularDefaultSession,
		selectedFiles: inputFiles,
	};

	return (
		<div
			css={css`
				margin-top: 8px;
				position: relative;
				.MuiPaper-elevation12 {
					// elevation in MUI controls drop shadow
					box-shadow: none;
				}
			`}
		>
			{error ? (
				<ErrorNotification size="sm">{error}</ErrorNotification>
			) : (
				<>
					{activeJbrowseType === JbrowseTypeNames.JBROWSE_CIRCULAR && (
						<JbrowseCircular {...jbrowseProps} defaultSession={jbrowseCircularDefaultSession} />
					)}
					{activeJbrowseType === JbrowseTypeNames.JBROWSE_LINEAR && (
						<JbrowseLinear {...jbrowseProps} defaultSession={jbrowseLinearDefaultSession} />
					)}
					<JbrowseSelectedFilesTable activeJbrowseType={activeJbrowseType} />
					{loading && <OverlayLoader />}
				</>
			)}
		</div>
	);
};

const JbrowseWrapper = ({ activeJbrowseType }: { activeJbrowseType: JbrowseTypeName }) => {
	// handle compatibility check before trying to load jbrowse,
	// in case the user comes to the jbrowse tab with an invalid selection.
	const { jbrowseCircularError, jbrowseLinearError, jbrowseLoading } = useJbrowseCompatibility();

	const errorDisplay =
		(activeJbrowseType === JbrowseTypeNames.JBROWSE_LINEAR && jbrowseLinearError) ||
		(activeJbrowseType === JbrowseTypeNames.JBROWSE_CIRCULAR && jbrowseCircularError);

	return jbrowseLoading ? (
		<OverlayLoader />
	) : errorDisplay ? (
		<div
			css={css`
				padding-top: 8px;
			`}
		>
			<ErrorNotification size="sm">{errorDisplay}</ErrorNotification>
		</div>
	) : (
		<JbrowseEl activeJbrowseType={activeJbrowseType} />
	);
};

export default JbrowseWrapper;
