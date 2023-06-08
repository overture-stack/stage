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

import { useEffect, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import urlJoin from 'url-join';
import { useTableContext } from '@overture-stack/arranger-components';
import { JbrowseLinear } from '@overture-stack/dms-jbrowse';
import SQON from '@overture-stack/sqon-builder';
import { find } from 'lodash';
import { getConfig } from '@/global/config';
import { SCORE_API_DOWNLOAD_PATH } from '@/global/utils/constants';
import createArrangerFetcher from '@/components/utils/arrangerFetcher';
import {
	JbrowseQueryNode,
	JbrowseCompatibleFile,
	JbrowseInput,
	ScoreDownloadJbrowseInput,
	ScoreDownloadResult,
	ScoreDownloadParams,
} from './types';
import { checkJbrowseCompatibility } from './utils';
import JbrowseSelectedFilesTable from './JbrowseSelectedFilesTable';

const arrangerFetcher = createArrangerFetcher({});

// request data for jbrowse display and
// score /download request to get signed URLs
const jbrowseInputQuery = `
query ($filters:JSON){
  file {
    hits (filters: $filters){
      total 
      edges {
        node {
          file_access
          file_type
          object_id
          file {
            name
            size
            index_file {
              object_id
              size
            }
          }
        }
      }
    }
  }
}
`;

const baseScoreDownloadParams = {
	external: 'true',
	offset: '0',
	'User-Agent': 'unknown',
};

const baseJbrowseInput = {
	fileURI: '',
	indexURI: '',
};

const JbrowseWrapper = () => {
	const { NEXT_PUBLIC_SCORE_API_URL } = getConfig();
	const theme = useTheme();
	const { selectedRows } = useTableContext({
		callerName: 'Jbrowse Display',
	});
	const [jbrowseEnabled, setJbrowseEnabled] = useState<boolean>(false);
	const [jbrowseCompatibleFiles, setJbrowseCompatibleFiles] = useState<JbrowseCompatibleFile[]>([]);
	const [jbrowseInput, setJbrowseInput] = useState<JbrowseInput[]>([]);
	const [scoreDownloadInput, setScoreDownloadInput] = useState<ScoreDownloadJbrowseInput[]>([]);

	useEffect(() => {
		// check if any files in selectedRows are compatible with jbrowse.
		// get the metadata for compatible files & indices, to use in score & jbrowse.
		arrangerFetcher({
			endpoint: 'graphql/TableDataQuery',
			body: JSON.stringify({
				variables: {
					filters: SQON.in('object_id', selectedRows),
				},
				query: jbrowseInputQuery,
			}),
		})
			.then(async ({ data }) => {
				// get files with at least 1 file with an acceptable file type, and an index file
				const nextJbrowseCompatibleFiles = data.file?.hits?.edges
					?.filter(
						({
							node: {
								file_access,
								file_type,
								file: { index_file },
							},
						}: {
							node: JbrowseQueryNode;
						}) => checkJbrowseCompatibility({ file_access, file_type, index_file }),
					)
					.map(
						({ node }: { node: JbrowseQueryNode }): JbrowseCompatibleFile => ({
							fileId: node.object_id,
							fileName: node.file.name,
							fileSize: node.file.size,
							fileType: node.file_type,
							// files without an index were filtered out above this map.
							// falsey handling is for typescript only.
							indexId: node.file.index_file?.object_id || '',
							indexSize: node.file.index_file?.size || 0,
						}),
					);
				setJbrowseCompatibleFiles(nextJbrowseCompatibleFiles);
				// setScoreDownloadInput(nextScoreDownloadInput);
				// setJbrowseInput(nextJbrowseInput);
			})
			.catch(async (err) => {
				setJbrowseEnabled(false);
				console.error(err);
			});
	}, [selectedRows]);

	useEffect(() => {
		// get score signed URLs for compatible files & indices
		Promise.all(
			jbrowseCompatibleFiles.map((file: JbrowseCompatibleFile) => {
				const scoreDownloadParams: ScoreDownloadParams = {
					...baseScoreDownloadParams,
					length: file.fileSize.toString(),
					object_id: file.fileId,
				};
				const urlParams = new URLSearchParams(scoreDownloadParams).toString();

				return fetch(
					urlJoin(NEXT_PUBLIC_SCORE_API_URL, SCORE_API_DOWNLOAD_PATH, file.fileId, `?${urlParams}`),
					{
						headers: { accept: '*/*' },
						method: 'GET',
					},
				).then((response) => response.json());
			}),
		)
			.then((results: ScoreDownloadResult[]) => {
				// put the result into jbrowseinput
				console.log('results', results);

				const nextJbrowseInput: JbrowseInput[] = jbrowseCompatibleFiles.map(
					({ fileId, fileName, fileType }) => ({
						fileId,
						fileName,
						fileType,
						fileURI: find(results, { objectId: fileId })?.parts[0].url || '',
						indexURI: '',
					}),
				);
				setJbrowseInput(nextJbrowseInput);
			})
			.catch((error: Error) => console.error(error));
	}, [jbrowseCompatibleFiles]);

	console.log('2. render: jbrowseInput', jbrowseInput);
	console.log('-------------------------------------');

	return (
		<div
			css={css`
				margin-top: 8px;
				.MuiPaper-elevation12 {
					// elevation in MUI controls drop shadow
					box-shadow: none;
				}
			`}
		>
			<JbrowseLinear
				configuration={{
					theme: {
						elevation: 0,
						palette: { secondary: { main: theme.colors.accent } },
					},
				}}
				selectedFiles={[]}
			/>
			<JbrowseSelectedFilesTable />
		</div>
	);
};

export default JbrowseWrapper;
