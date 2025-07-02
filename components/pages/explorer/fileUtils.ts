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

import { getConfig } from '@/global/config';
import { SCORE_API_DOWNLOAD_PATH } from '@/global/utils/constants';
import { type APIFetcherFn } from '@overture-stack/arranger-components/dist/DataContext/types';
import axios from 'axios';
import urlJoin from 'url-join';
import { baseScoreDownloadParams, JBrowseFileExtensions } from './constants';
import { type FileMetaData, type FileTableData, type FileResponse, type ScoreDownloadParams } from './fileTypes';

// Type Check for Table Data unknown[]
export const rowIsFileData = (row: unknown): row is FileTableData => {
	const rowData = row as FileTableData;
	return Boolean(rowData?.id && rowData?.file_type && JBrowseFileExtensions.includes(rowData?.file_type));
};

// Type Check for Score Data response
export const isFileMetaData = (file: any): file is FileMetaData => {
	return Boolean((file as FileMetaData)?.objectId && (file as FileMetaData)?.parts[0]?.url);
};

export const getScoreDownloadUrls = async ({ length, object_id }: { length: string; object_id: string }) => {
	const { NEXT_PUBLIC_SCORE_API_URL } = getConfig();
	const scoreDownloadParams: ScoreDownloadParams = {
		...baseScoreDownloadParams,
		length,
	};
	const urlParams = new URLSearchParams(scoreDownloadParams).toString();
	try {
		const response = await axios.get(
			urlJoin(NEXT_PUBLIC_SCORE_API_URL, SCORE_API_DOWNLOAD_PATH, object_id, `?${urlParams}`),
			{
				headers: { accept: '*/*' },
			},
		);

		if (response.status === 200) {
			return response.data;
		}
	} catch (err: unknown) {
		console.error(`Error at getScoreDownloadUrls with object_id ${object_id}`);
		console.error(err);
	}
};

export const IndexFileQuery = `query IndexFile ($sqon: JSON) {
  file {
		hits (filters: $sqon) {
			total
			edges {
				node {
					file {
						index_file {
							name
							object_id
							size
						}
					}
				}
			}
		} 
  }
}`;

export const getIndexFileData = async ({
	apiFetcher,
	fileId,
}: {
	apiFetcher: APIFetcherFn;
	fileId: string | undefined;
}) =>
	// TODO: Add apiFetcher Type Argument
	(await apiFetcher({
		endpointTag: 'GetIndexFileData',
		body: {
			query: IndexFileQuery,
			variables: {
				first: 1,
				sqon: {
					content: [{ op: 'in', content: { fieldName: '_id', value: fileId } }],
					op: 'and',
				},
			},
		},
	})) as Promise<FileResponse>;

export const getFileMetaData = async (selectedBamFile: FileTableData, indexFile: any) => {
	const fileSize = selectedBamFile.file?.size?.toString();
	const fileObjectId = selectedBamFile.id;

	const { object_id: indexObjectId, size: indexFileSize } = indexFile;

	const fileMetaData = await getScoreDownloadUrls({ length: fileSize, object_id: fileObjectId });
	const indexFileMetaData = await getScoreDownloadUrls({ length: indexFileSize, object_id: indexObjectId });

	return { fileMetaData, indexFileMetaData };
};
