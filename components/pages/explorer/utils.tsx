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
import { Theme } from '@emotion/react';
import urlJoin from 'url-join';

const bamFileExtension = 'BAM';
const cramFileExtension = 'CRAM';

export const BamFileExtensions = [bamFileExtension, cramFileExtension];

export type FileMetaData = {
	objectId: string;
	objectKey?: string;
	objectMd5?: string;
	objectSize?: number;
	parts: {
		md5?: string | null;
		offset?: number;
		partNumber?: number;
		partSize?: number;
		url: string;
	}[];
	uploadId?: string;
};

export const demoFileMetadata = {
	objectId: 'demoFileData',
	parts: [
		{
			url: 'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam',
		},
	],
};

export const getFileMetaData = async (selectedBamFile: FileType) => {
	const fileMetaData = await getScoreDownloadUrls('file', selectedBamFile);
	return fileMetaData;
};

export const baseScoreDownloadParams = {
	external: 'true',
	offset: '0',
	'User-Agent': 'unknown',
};

export type ScoreDownloadParams = {
	'User-Agent': string;
	external: string;
	length: string;
	offset: string;
};

export const getScoreDownloadUrls = async (type: 'file' | 'index', fileData: FileType) => {
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
			return res as FileMetaData;
		})
		.catch((error) => {
			console.error(`Error at getScoreDownloadUrls with object_id ${object_id}`, error);
		});
};

export type FileType = { id: string; file: { size: number } };

export const getToggleButtonStyles = (active: boolean, theme: Theme) =>
	active
		? `
			background-color: ${theme.colors.white};
			color: ${theme.colors.accent};
		`
		: `
			background-color: ${theme.colors.accent};
			color: ${theme.colors.white};
		`;
