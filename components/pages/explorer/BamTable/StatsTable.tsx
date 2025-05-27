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

import { css } from '@emotion/react';
import { type FileTableData } from '../fileTypes';

export const StatsTable = ({ file, fileId = '' }: { file: FileTableData; fileId?: string }) => {
	const fileAccess = file?.file_access;
	const fileDataType = file?.data_type;
	const fileDonorId = file?.donors?.hits.edges[0].node.submitter_donor_id;
	const fileFormat = file?.file_type; // format
	const fileSize = file?.file.size;
	const fileStudy = file?.analysis?.collaborator.hits.edges[0].node.name;
	const fileStrategy = file?.analysis?.experiment.experimentalStrategy;

	return (
		<div
			css={css`
				display: flex;
				flex-basis: 100%;
				flex-direction: column;
				font-size: 10px;
			`}
		>
			<tr
				css={css`
					border: 1px solid black;
					display: flex;
					flex-basis: 100%;

					th {
						border: 1px solid black;
						display: inline-flex;
						flex: 1;
					}
				`}
			>
				<th>File ID</th>
				<th>Donor ID</th>
				<th>Study</th>
				<th>Data Type</th>
				<th>Strategy</th>
				<th>Format</th>
				<th>Size</th>
				<th>File Access</th>
			</tr>
			<tr
				css={css`
					border: 1px solid black;
					display: flex;
					flex-basis: 100%;
					margin-bottom: 10px;

					td {
						border: 1px solid black;
						border-top: none;
						display: inline-flex;
						flex: 1;
					}
				`}
			>
				<td>{fileId}</td>
				<td>{fileDonorId}</td>
				<td>{fileStudy}</td>
				<td>{fileDataType}</td>
				<td>{fileStrategy}</td>
				<td>{fileFormat}</td>
				<td>{fileSize}</td>
				<td>{fileAccess}</td>
			</tr>
		</div>
	);
};
