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

import { JBrowseFileExtensions } from './constants';

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

export type ScoreDownloadParams = {
	'User-Agent': string;
	external: string;
	length: string;
	offset: string;
};

export type FileTableData = {
	id: string;
	analysis?: {
		collaborator?: {
			hits: {
				edges: [
					{
						node: {
							name: string;
						};
					},
				];
			};
		};
		experiment?: { experimentalStrategy: string; platform: string };
	};
	data_type?: string;
	donors?: {
		hits: {
			edges: [
				{
					node: {
						submitter_donor_id: string;
					};
				},
			];
		};
	};
	file_access?: string;
	file_type?: string;
	file: { size: number };
};

// Type Check for Table Data unknown[]
export const rowIsFileData = (row: unknown): row is FileTableData => {
	const rowData = row as FileTableData;
	return Boolean(rowData?.id && rowData?.file_type && JBrowseFileExtensions.includes(rowData?.file_type));
};
