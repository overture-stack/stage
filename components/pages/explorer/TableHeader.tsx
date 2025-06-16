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
import { ColumnsSelectButton, DownloadButton, useArrangerTheme } from '@overture-stack/arranger-components';
import urlJoin from 'url-join';

import StyledLink from '@/components/Link';
import { Download } from '@/components/theme/icons';
import { getConfig } from '@/global/config';
import { INTERNAL_API_PROXY } from '@/global/utils/constants';
import { FileButton, FullScreenButton, VisualizerButton } from './HeaderButtons';

const TableHeader = ({
	iconColor,
	isBamFileSelected,
	isFileTableActive,
	isFullScreen,
	toggleFullScreen,
	setTable,
	openModal,
}: {
	iconColor: string;
	isBamFileSelected: boolean;
	isFileTableActive: boolean;
	isFullScreen: boolean;
	toggleFullScreen: () => void;
	setTable: (s: string) => void;
	openModal: () => void;
}) => {
	const { NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS } = getConfig();
	const theme = useTheme();

	const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
	const manifestColumns = NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS.split(',')
		.filter((field) => field.trim()) // break it into arrays, and ensure there's no empty field names
		.map((fieldName) => fieldName.replace(/['"]+/g, '').trim());
	const customExporters = [
		{ label: 'File Table', fileName: `data-explorer-table-export.${today}.tsv` }, // exports a TSV with what is displayed on the table (columns selected, etc.)
		{ label: 'File Manifest', fileName: `score-manifest.${today}.tsv`, columns: manifestColumns }, // exports a TSV with the manifest columns
		{
			label: () => (
				<span
					css={css`
						border-top: 1px solid ${theme.colors.grey_3};
						margin-top: -3px;
						padding-top: 7px;
						white-space: pre-line;

						a {
							margin-left: 3px;
						}
					`}
				>
					To download files using a file manifest, please follow these
					<StyledLink
						css={css`
							line-height: inherit;
						`}
						href="https://www.overture.bio/documentation/guides/download/clientdownload/"
						rel="noopener noreferrer"
						target="_blank"
					>
						instructions
					</StyledLink>
					.
				</span>
			),
		},
	];

	const buttonStyles = {
		callerName: 'TableHeader',
		components: {
			Table: {
				DownloadButton: {
					customExporters,
					css: css`
						border-radius: 0.5rem;
						padding: 0.3rem 0.8rem;
						margin-left: 0.5rem;
						:hover {
							color: ${theme.colors.accent_dark};
							svg {
								background-color: ${theme.colors.secondary_light};
								path {
									fill: ${theme.colors.accent_dark};
								}
							}
						}
						:disabled {
							svg {
								background-color: ${theme.colors.secondary_light};
							}
							path {
								fill: ${theme.colors.grey_5};
							}
						}
					`,
					downloadUrl: urlJoin(INTERNAL_API_PROXY.ARRANGER, 'download'),
					label: () => (
						<>
							<Download
								fill={theme.colors.white}
								style={css`
									color: ${theme.colors.white};
									background-color: ${theme.colors.accent};
									margin-right: 0.2rem;
								`}
							/>{' '}
							Download
						</>
					),
					ListWrapper: {
						width: '11rem',
					},
				},
				DropDown: {
					arrowColor: theme.colors.white,
					arrowTransition: 'all 0s',
					background: theme.colors.accent,
					borderColor: theme.colors.grey_5,
					css: css`
						${theme.typography.subheading2}
						border-radius: 0.5rem;
						line-height: 1.3rem;
						padding: 0.3rem 0.8rem;
						:disabled {
							path {
								fill: ${theme.colors.grey_5};
							}
						}
						:hover {
							color: ${theme.colors.accent_dark};
							svg {
								path {
									fill: ${theme.colors.accent_dark};
								}
							}
						}
					`,
					disabledFontColor: theme.colors.grey_5,
					fontColor: theme.colors.white,
					hoverBackground: theme.colors.secondary_light,

					ListWrapper: {
						background: theme.colors.white,
						css: css`
							${theme.shadow.default}
						`,
						fontColor: theme.colors.black,
						fontSize: '0.7rem',
						hoverBackground: theme.colors.secondary_light,
					},
				},
			},
		},
	};

	useArrangerTheme(buttonStyles);

	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
			`}
		>
			{isFileTableActive ? (
				<>
					<VisualizerButton
						iconColor={iconColor}
						isBamFileSelected={isBamFileSelected}
						isFileTableActive={isFileTableActive}
						openModal={openModal}
					/>
					<div
						css={css`
							display: inline-flex;
						`}
					>
						<ColumnsSelectButton />
						<DownloadButton />
					</div>
				</>
			) : (
				<>
					<FileButton setTable={setTable} />
					<FullScreenButton isFullScreen={isFullScreen} setFullScreen={toggleFullScreen} />
				</>
			)}
		</div>
	);
};

export default TableHeader;
