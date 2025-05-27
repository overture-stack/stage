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

import { css, useTheme } from '@emotion/react';
import { useTableContext } from '@overture-stack/arranger-components';
import { useState } from 'react';

import defaultTheme from '../../../theme/';
import { ChevronDown } from '../../../theme/icons';
import { type FileTableData } from '../fileTypes';

export const StatsTable = ({ file, fileId = '' }: { file: FileTableData; fileId?: string }) => {
	const [showTable, setShowTable] = useState(true);
	const { selectedRows } = useTableContext({ callerName: 'File Metadata Table' });
	const theme: typeof defaultTheme = useTheme();
	const fileAccess = file?.file_access;
	const fileDataType = file?.data_type;
	const fileDonorId = file?.donors?.hits.edges[0].node.submitter_donor_id;
	const fileFormat = file?.file_type;
	const fileSize = file?.file.size;
	const fileStudy = file?.analysis?.collaborator.hits.edges[0].node.name;
	const fileStrategy = file?.analysis?.experiment.experimentalStrategy;

	return (
		<>
			<div
				className={'statsTable-toolbar'}
				css={css`
					display: flex;
					flex-basis: 100%;
					flex-direction: row;
					justify-content: space-between;
					padding: 5px;
				`}
			>
				<span
					css={css`
						display: inline-flex;
						font-size: 16px;
						font-weight: 700;
						line-height: 24px;
						letter-spacing: 0px;
					`}
				>
					{selectedRows.length} File{`${selectedRows.length > 1 ? 's' : ''}`} Selected
				</span>
				<button
					css={css`
						align-items: center;
						display: inline-flex;
						border-radius: 5px;
						border: 1px solid ${theme.colors.grey_3};
						font-size: 11px;
						font-weight: 700;
						line-height: 24px;
					`}
					onClick={() => {
						setShowTable(!showTable);
					}}
				>
					{showTable ? 'Hide' : 'Show'} Table
					<div
						css={css`
							background-color: ${theme.colors.white};
							border-radius: 3px;
							border: 1px solid ${theme.colors.grey_5};
							height: 13px;
							margin-left: 10px;
							padding: 2px;
							${showTable ? 'transform: rotate(180deg);' : 'transform: rotate(0deg);'}

							svg {
								position: relative;
								top: -3px;
							}
						`}
					>
						<ChevronDown height={13} width={13} fill={theme.colors.grey_5} />
					</div>
				</button>
			</div>
			{showTable ? (
				<div
					className={'statsTable'}
					css={css`
						display: flex;
						flex-basis: 100%;
						flex-direction: column;
						font-size: 10px;
					`}
				>
					<tr
						css={css`
							border: 1px solid ${theme.colors.grey_5};
							border-bottom: 0;
							display: flex;
							flex-basis: 100%;

							th {
								border-right: 1px solid ${theme.colors.grey_5};
								:last-child {
									border-right: 0;
								}
								display: inline-flex;
								flex: 1;
								font-weight: 700;
								font-size: 13px;
								line-height: 14px;
								letter-spacing: 0px;
								padding: 5px;
								vertical-align: middle;
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
							border: 1px solid ${theme.colors.grey_5};
							display: flex;
							flex-basis: 100%;
							margin-bottom: 10px;

							td {
								border-right: 1px solid ${theme.colors.grey_5};
								:last-child {
									border-right: 0;
								}
								border-top: 0;
								display: inline-flex;
								flex: 1;
								font-weight: 400;
								font-size: 13px;
								line-height: 14px;
								letter-spacing: 0px;
								padding: 5px;
								vertical-align: middle;
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
			) : null}
		</>
	);
};
