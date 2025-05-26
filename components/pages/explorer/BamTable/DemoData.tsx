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

/* TODO: Remove Demo Data logic */
import { css, Theme } from '@emotion/react';
import { SetStateAction } from 'react';
import { FileMetaData, FileTableData } from '../fileTypes';
import { getToggleButtonStyles } from '../getButtonStyles';

export const demoFileMetadata: FileMetaData = {
	objectId: 'demoFileData',
	parts: [
		{
			url: 'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam',
		},
	],
};

export const DemoDataButton = ({
	isDemoData,
	file,
	loadAndSetFile,
	loading,
	setFileMetaData,
	setLoading,
	theme,
}: {
	isDemoData: boolean;
	file?: FileTableData;
	loadAndSetFile: (file: FileTableData) => Promise<void>;
	loading: boolean;
	setFileMetaData: (value: SetStateAction<FileMetaData | undefined>) => void;
	setLoading: (value: SetStateAction<boolean>) => void;
	theme: Theme;
}) => {
	const loadDemoFile = async () => {
		setLoading(true);
		setFileMetaData(undefined);
		if (isDemoData && file) {
			await loadAndSetFile(file);
		} else {
			setFileMetaData(demoFileMetadata);
		}
	};

	if (isDemoData && loading) {
		setLoading(false);
	}

	return (
		<div>
			<button
				css={css`
					border: 2px solid ${theme.colors.accent};
					border-radius: 5px;
					min-width: fit-content;
					padding: 3px 10px;
					${getToggleButtonStyles(isDemoData, theme)}
				`}
				onClick={loadDemoFile}
			>
				{isDemoData ? 'View File Data' : 'View Demo Data'}
			</button>
		</div>
	);
};

export const DemoStatsFile = {
	statistics: {
		mapped_reads: 92917,
		mapped_reads_percentage: 0.9976,
		forward_strands: 46736,
		forward_strands_percentage: 0.5018,
		proper_pairs: 91702,
		proper_pairs_percentage: 0.9846,
		singletons: 220,
		singletons_percentage: 0.002362,
		both_mates_mapped: 92697,
		both_mates_mapped_percentage: 0.9953,
		duplicates: 397,
		duplicates_percentage: 0.004263,
		failed_qc: 0,
		first_mates: 46553,
		last_read_position: 4467990,
		paired_end_reads: 93136,
		reverse_strands: 46400,
		second_mates: 46583,
		total_reads: 93136,
		mean_read_coverage: 52,
	},
};
