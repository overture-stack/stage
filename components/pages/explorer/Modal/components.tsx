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

import { css, useTheme, Theme } from '@emotion/react';
import urlJoin from 'url-join';
import { getConfig } from '../../../../global/config';
import { bamFileExtensions } from '@overture-stack/iobio-components/packages/iobio-react-components/';
import { tableTypes } from '../constants';
import { type FileTableData } from '../fileTypes';
import { type BadgeItem, type VisualizerDetailProps } from './types';

const accentBadgeStyle = ({ theme, isDisabled }: { theme: Theme; isDisabled: boolean }) => css`
	${badgeStyle({ theme, isDisabled })}
	background-color: ${theme.colors.accent_light};
	margin-left: 5px;
	${isDisabled ? `background-color: ${theme.colors.grey_5};` : ''}
`;

const badgeStyle = ({ theme, isDisabled }: { theme: Theme; isDisabled: boolean }) => css`
	display: inline-flex;
	border: none;
	border-radius: 20px;
	margin: 5px;
	margin-left: 0px;
	min-width: fit-content;
	padding: 3px 10px;
	background-color: ${theme.colors.accent};
	color: ${theme.colors.white};

	${isDisabled ? `background-color: ${theme.colors.grey_6};` : ''}
`;

const optionStyle = ({ theme, isEnabled }: { theme: Theme; isEnabled: boolean }) => css`
	background: unset;
	border: 1px solid ${theme.colors.grey_5};
	border-radius: 16px;
	cursor: pointer;
	display: inline-flex;
	flex: 1;
	font-family: 'Lato', sans-serif;
	margin: 0 0.5rem;
	padding: 10px;
	position: relative;

	${isEnabled ? '' : `cursor: not-allowed;`}
`;

export const VisualizerDetail = ({ title, description, previewImage, logoImage }: VisualizerDetailProps) => {
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
	const badgeGroup = badges.map((badge, index) => {
		const badgeCss = badge.isAccent
			? accentBadgeStyle({ theme, isDisabled: !isEnabled })
			: badgeStyle({ theme, isDisabled: !isEnabled });
		return (
			<div key={`badge-${index}`} css={badgeCss}>
				{badge.label}
			</div>
		);
	});
	return <>{badgeGroup}</>;
};

export const VisualizerOption = ({
	badges,
	details: { title, description, previewImage, logoImage },
	isEnabled,
	onClick,
}: {
	badges: BadgeItem[];
	details: VisualizerDetailProps;
	isEnabled: boolean;
	onClick: () => void;
}) => {
	const theme = useTheme();
	return (
		<button css={optionStyle({ theme, isEnabled })} disabled={!isEnabled} onClick={onClick}>
			<div>
				<VisualizerDetail title={title} description={description} previewImage={previewImage} logoImage={logoImage} />

				<div
					css={css`
						position: absolute;
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
		bamFileExtensions.includes(currentFiles[0].file_type);

	const selectVisualizer = (tableType: string) => () => {
		setTable(tableType);
		closeModal();
	};

	return (
		<>
			<VisualizerOption
				badges={[
					{ label: '5 Max', isAccent: false },
					{ label: '.VCF', isAccent: true },
					{ label: '.BAM', isAccent: true },
				]}
				onClick={selectVisualizer(tableTypes.JBROWSE_TABLE)}
				isEnabled={isJbrowseEnabled}
				details={{
					title: 'JBrowse',
					description:
						'A fully featured genome browser that is capable of visualizing diverse types of genome-located data.',
					previewImage: urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/jBrowse_Preview.png'),
					logoImage: urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/jBrowse_Logo.png'),
				}}
			/>
			<VisualizerOption
				badges={[
					{ label: '1 Max', isAccent: false },
					{ label: '.BAM', isAccent: true },
				]}
				onClick={selectVisualizer(tableTypes.BAM_TABLE)}
				isEnabled={!!isIobioEnabled}
				details={{
					title: 'IOBIO',
					description: 'Examine your sequence alignment file in seconds',
					previewImage: urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/IOBIO_Preview.png'),
					logoImage: urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/IOBIO_Logo.png'),
				}}
			/>
			<VisualizerOption
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
				onClick={selectVisualizer(tableTypes.CBIO_TABLE)}
			/>
		</>
	);
};
