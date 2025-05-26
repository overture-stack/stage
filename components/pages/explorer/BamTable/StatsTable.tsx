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

import { DemoStatsFile } from './DemoData';
import { css } from '@emotion/react';

export const StatsTable = () => {
	const {
		mapped_reads,
		mapped_reads_percentage,
		forward_strands,
		forward_strands_percentage,
		proper_pairs,
		proper_pairs_percentage,
		singletons,
		singletons_percentage,
		both_mates_mapped,
		both_mates_mapped_percentage,
		duplicates,
		duplicates_percentage,
		failed_qc,
		first_mates,
		last_read_position,
		paired_end_reads,
		reverse_strands,
		second_mates,
		total_reads,
		mean_read_coverage,
	} = DemoStatsFile.statistics;

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
				<th>Mapped Reads</th>
				<th>Mapped Reads Percentage</th>
				<th>Forward Strands</th>
				<th>Forward Strands Percentage</th>
				<th>Proper Pairs</th>
				<th>Proper Pairs percentage</th>
				<th>Singletons</th>
				<th>Singletons Percentage</th>
				<th>Both Mates Mapped</th>
				<th>Both Mates Mapped Percentage</th>
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
				<td>{mapped_reads}</td>
				<td>{mapped_reads_percentage}</td>
				<td>{forward_strands}</td>
				<td>{forward_strands_percentage}</td>
				<td>{proper_pairs}</td>
				<td>{proper_pairs_percentage}</td>
				<td>{singletons}</td>
				<td>{singletons_percentage}</td>
				<td>{both_mates_mapped}</td>
				<td>{both_mates_mapped_percentage}</td>
			</tr>
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
				<th>Duplicates</th>
				<th>Duplicates Percentage</th>
				<th>Failed QC</th>
				<th>First Mates</th>
				<th>Last Read Position</th>
				<th>Paired End Reads</th>
				<th>Reverse Strands</th>
				<th>Second Mates</th>
				<th>Total Reads</th>
				<th>Mean Read Coverage</th>
			</tr>
			<tr
				css={css`
					border: 1px solid black;
					display: flex;
					flex-basis: 100%;

					td {
						border: 1px solid black;
						border-top: none;
						display: inline-flex;
						flex: 1;
					}
				`}
			>
				<td>{duplicates}</td>
				<td>{duplicates_percentage}</td>
				<td>{failed_qc}</td>
				<td>{first_mates}</td>
				<td>{last_read_position}</td>
				<td>{paired_end_reads}</td>
				<td>{reverse_strands}</td>
				<td>{second_mates}</td>
				<td>{total_reads}</td>
				<td>{mean_read_coverage}</td>
			</tr>
		</div>
	);
};
