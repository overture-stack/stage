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
import axios from 'axios';
import urlJoin from 'url-join';
import { baseScoreDownloadParams } from './constants';
import { type FileMetaData, type FileTableData, type ScoreDownloadParams } from './fileTypes';

// Type Check for Table Data unknown[]
export const rowIsFileData = (row: unknown): row is FileTableData => {
	const rowData = row as FileTableData;
	return Boolean(rowData?.id && rowData?.file_type);
};

// Type Check for Score Data response
export const isFileMetaData = (file: any): file is FileMetaData => {
	return Boolean((file as FileMetaData)?.objectId && (file as FileMetaData)?.parts[0]?.url);
};

export const getScoreDownloadUrls = async (fileData: FileTableData) => {
	const { NEXT_PUBLIC_SCORE_API_URL } = getConfig();
	const length = fileData.file?.size?.toString();
	const object_id = fileData.id;

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

export const getFileMetaData = async (selectedBamFile: FileTableData) => {
	const fileMetaData = await getScoreDownloadUrls(selectedBamFile);
	return fileMetaData;
};
