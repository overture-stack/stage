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

import axios from 'axios';
import urlJoin from 'url-join';

import { getConfig } from '@/global/config';
import { SCORE_API_DOWNLOAD_PATH } from '@/global/utils/constants';

import { baseScoreDownloadParams } from '../constants';
import {
	type FileMetaData,
	type FileNode,
	type FileTableData,
	type FileResponse,
	type ScoreDownloadParams,
} from '../fileTypes';

// Type Checks for Score Data response
export const isFileMetaData = (file: unknown): file is FileMetaData => {
	return Boolean((file as FileMetaData)?.objectId && (file as FileMetaData)?.parts[0]?.url);
};

export const isFileResponse = (response: unknown): response is FileResponse => {
	return Boolean((response as FileResponse)?.data?.file.hits);
};

export const getScoreFile = async ({
	length,
	object_id,
}: {
	length: string;
	object_id: string;
}): Promise<FileMetaData | undefined> => {
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
		console.error(`Error at getScoreFile with object_id ${object_id}`);
		console.error(err);
	}
};

export const getFileMetaData = async (selectedBamFile: FileTableData, indexFileNode: FileNode) => {
	// Base BAM File download
	const fileSize = selectedBamFile.file.size.toString();
	const fileObjectId = selectedBamFile.id;
	const fileMetaData = await getScoreFile({ length: fileSize, object_id: fileObjectId });

	// Related Index File download
	const { object_id: indexObjectId, size: indexFileSize } = indexFileNode.node.file.index_file;
	const indexFileMetaData = await getScoreFile({ length: indexFileSize.toString(), object_id: indexObjectId });

	return { fileMetaData, indexFileMetaData };
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
