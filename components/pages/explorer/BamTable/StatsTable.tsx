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
		<>
			<p>Mapped Reads: {mapped_reads}</p>
			<p>Mapped Reads Percentage: {mapped_reads_percentage}</p>
			<p>Forward Strands: {forward_strands}</p>
			<p>Forward Strands Percentage: {forward_strands_percentage}</p>
			<p>Proper Pairs: {proper_pairs}</p>
			<p>Proper Pairs percentage: {proper_pairs_percentage}</p>
			<p>Singletons: {singletons}</p>
			<p>Singletons Percentage: {singletons_percentage}</p>
			<p>Both Mates Mapped: {both_mates_mapped}</p>
			<p>Both Mates Mapped Percentage: {both_mates_mapped_percentage}</p>
			<p>Duplicates: {duplicates}</p>
			<p>Duplicates Percentage: {duplicates_percentage}</p>
			<p>Failed QC: {failed_qc}</p>
			<p>First Mates: {first_mates}</p>
			<p>Last Read Position: {last_read_position}</p>
			<p>Paired End Reads: {paired_end_reads}</p>
			<p>Reverse Strands: {reverse_strands}</p>
			<p>Second Mates: {second_mates}</p>
			<p>Total Reads: {total_reads}</p>
			<p>Mean Read Coverage: {mean_read_coverage}</p>
		</>
	);
};
