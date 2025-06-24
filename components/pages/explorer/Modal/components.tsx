/*
 *
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
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
import urlJoin from 'url-join';
import { getConfig } from '../../../../global/config';
import { BamFileExtensions, tableTypes } from '../constants';
import { FileTableData } from '../fileTypes';
import { badgeStyle, accentBadgeStyle, optionStyle } from './styles';
import { BadgeItem, VizDetailProps } from './types';

export const VizDetail = ({ title, description, previewImage, logoImage }: VizDetailProps) => {
	return (
		<>
			<div
				css={css`
					max-height: 28%;
					overflow-y: hidden;

					img {
						width: 100%;
					}
				`}
			>
				<img src={previewImage} />
			</div>
			<div
				css={css`
					text-align: left;
				`}
			>
				<img
					css={css`
						height: 18px;
						vertical-align: text-bottom;
						width: 18px;
					`}
					src={logoImage}
				/>
				<h4
					css={css`
						display: inline-block;
						font-size: 18px;
						margin: 0.5rem;
					`}
				>
					{title}
				</h4>
			</div>
			<p
				css={css`
					font-weight: 400;
					font-size: 16px;
					line-height: 16px;
					margin-top: 0px;
					text-align: left;
					height: 30%;
				`}
			>
				{description}
			</p>
		</>
	);
};

export const Badges = ({ isEnabled, badges }: { isEnabled: boolean; badges: BadgeItem[] }) => {
	const theme = useTheme();
	const badgeGroup = badges.map((badge) => {
		const badgeCss = badge.isAccent
			? accentBadgeStyle({ theme, isDisabled: !isEnabled })
			: badgeStyle({ theme, isDisabled: !isEnabled });
		return <div css={badgeCss}>{badge.label}</div>;
	});
	return <>{badgeGroup}</>;
};

export const VizualizerOption = ({
	badges,
	details: { title, description, previewImage, logoImage },
	isEnabled,
	onClick,
}: {
	badges: BadgeItem[];
	details: VizDetailProps;
	isEnabled: boolean;
	onClick: () => void;
}) => {
	const theme = useTheme();
	return (
		<button css={optionStyle({ theme, isEnabled })} disabled={!isEnabled} onClick={onClick}>
			<div>
				<VizDetail title={title} description={description} previewImage={previewImage} logoImage={logoImage} />

				<div
					css={css`
						bottom: 10px;
					`}
				>
					<h5
						css={css`
							font-weight: 700;
							font-size: 16px;
							margin: 0.25rem 0;
							text-align: left;
						`}
					>
						Files:
					</h5>
					<div
						css={css`
							display: flex;
						`}
					>
						<Badges isEnabled={isEnabled} badges={badges} />
					</div>
				</div>
			</div>
		</button>
	);
};

/**
 *
 * Responsibility is rendering the options available
 * ie. read configs, gather data etc then render each option with data
 *
 */
export const VisualizerModal = ({
	closeModal,
	setTable,
	currentFiles,
}: {
	closeModal: () => void;
	setTable: (tableType: string) => void;
	currentFiles: FileTableData[];
}) => {
	const {
		NEXT_PUBLIC_BASE_PATH,
		NEXT_PUBLIC_IOBIO_ENABLED,
		NEXT_PUBLIC_JBROWSE_ENABLED,
		NEXT_PUBLIC_CBIOPORTAL_ENABLED,
	} = getConfig();

	const isJbrowseEnabled = NEXT_PUBLIC_JBROWSE_ENABLED && currentFiles.length <= 5;
	const isCBioEnabled = NEXT_PUBLIC_CBIOPORTAL_ENABLED && currentFiles.length <= 2;
	const isIobioEnabled =
		NEXT_PUBLIC_IOBIO_ENABLED &&
		currentFiles.length === 1 &&
		currentFiles[0].file_type &&
		BamFileExtensions.includes(currentFiles[0].file_type);

	const selectViz = (tableType: string) => () => {
		setTable(tableType);
		closeModal();
	};

	return (
		<>
			<VizualizerOption
				badges={[
					{ label: '5 Max', isAccent: false },
					{ label: '.VCF', isAccent: true },
					{ label: '.BAM', isAccent: true },
				]}
				onClick={selectViz(tableTypes.JBROWSE_TABLE)}
				isEnabled={isJbrowseEnabled}
				details={{
					title: 'JBrowse',
					description:
						'A fully featured genome browser that is capable of visualizing diverse types of genome-located data.',
					previewImage: urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/jBrowse_Preview.png'),
					logoImage: urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/jBrowse_Logo.png'),
				}}
			/>
			<VizualizerOption
				badges={[
					{ label: '1 Max', isAccent: false },
					{ label: '.BAM', isAccent: true },
				]}
				onClick={selectViz(tableTypes.BAM_TABLE)}
				isEnabled={!!isIobioEnabled}
				details={{
					title: 'IOBIO',
					description: 'Examine your sequence alignment file in seconds',
					previewImage: urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/IOBIO_Preview.png'),
					logoImage: urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/IOBIO_Logo.png'),
				}}
			/>
			<VizualizerOption
				badges={[
					{ label: '2 Max', isAccent: false },
					{ label: '.VCF', isAccent: true },
					{ label: '.BAM', isAccent: true },
				]}
				details={{
					title: 'cBioPortal',
					description: 'Provides visualization, analysis and download of large-scale cancer genomics data sets.',
					previewImage: urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/cBioPortal_Preview.png'),
					logoImage: urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/cBioPortal_Logo.png'),
				}}
				isEnabled={isCBioEnabled}
				onClick={selectViz(tableTypes.CBIO_TABLE)}
			/>
		</>
	);
};
