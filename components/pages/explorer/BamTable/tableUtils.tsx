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

import { type FileTableData } from '../fileTypes';

const getFileSizeString = (numFileSize: number) =>
	numFileSize < 10 ** 3
		? `${numFileSize} bytes`
		: numFileSize < 10 ** 6
		? `${(numFileSize / 10 ** 3).toFixed(2)} KB`
		: numFileSize < 10 ** 9
		? `${(numFileSize / 10 ** 6).toFixed(2)} MB`
		: numFileSize < 10 ** 12
		? `${(numFileSize / 10 ** 9).toFixed(2)} GB`
		: `${(numFileSize / 10 ** 12).toFixed(2)} TB`;

export const getTableData = (file: FileTableData) => {
	const fileAccess = file?.file_access;
	const fileDataType = file?.data_type;
	const fileDonorId = file?.donors?.hits.edges[0].node.submitter_donor_id;
	const fileFormat = file?.file_type;
	const fileStudy = file?.analysis?.collaborator?.hits.edges[0].node.name;
	const fileStrategy = file?.analysis?.experiment?.experimentalStrategy;
	const numFileSize = file?.file.size ?? 0;
	const fileSize = getFileSizeString(numFileSize);

	return { fileAccess, fileDataType, fileDonorId, fileFormat, fileStudy, fileStrategy, fileSize };
};

export const IobioFileQuery = `query IobioFile ($sqon: JSON) {
  file {
    hits (filters: $sqon) {
      total
      edges {
        node {
          file {
						object_id
						data_type
						file_access
						file_type
						analysis
							experiment { experimentalStrategy }
						}
						file {
							size
							name
							data_type
							index_file
								object_id
								name
								file_type
								md5sum
								data_type
								size
								dataCategory
							}
						}
          }
        }
      }
    } 
  }
}`;
