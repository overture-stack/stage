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

import { type SetStateAction } from 'react';
import ReactModal from 'react-modal';
import { css, useTheme } from '@emotion/react';
import urlJoin from 'url-join';
import { Dismiss } from '../../theme/icons';
import { getConfig } from '../../../global/config';
import { BamFileExtensions, tableTypes } from './constants';
import { FileTableData } from './fileTypes';

export const VisualizerModal = ({
	closeModal,
	currentFiles,
	firstRender,
	isModalOpen,
	setTable,
}: {
	closeModal: () => void;
	firstRender: boolean;
	isModalOpen: boolean;
	setTable: (value: SetStateAction<string>) => void;
	currentFiles: FileTableData[];
}) => {
	const theme = useTheme();
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

	return (
		<ReactModal
			ariaHideApp={!!firstRender}
			isOpen={isModalOpen}
			style={{
				overlay: {
					zIndex: 10,
					backgroundColor: 'rgba(0,0,0,0.7)',
				},
				content: {
					top: '15%',
					left: '20%',
					width: '60%',
					height: '70%',
					padding: '12px',
				},
			}}
		>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					font-family: 'Lato', sans-serif;
					height: 100%;
				`}
			>
				<div
					css={css`
						display: flex;
						justify-content: end;
					`}
				>
					<button
						css={css`
							background: unset;
							border: unset;
							cursor: pointer;
							:hover {
								svg {
									path {
										fill: ${theme.colors.grey_5};
									}
								}
							}
						`}
						onClick={closeModal}
					>
						<Dismiss
							style={css`
								vertical-align: middle;
							`}
							height={12}
							width={12}
							fill={theme.colors.accent_dark}
						/>
					</button>
				</div>
				<h3
					css={css`
						font-size: 24px;
						font-weight: 700;
						line-height: 38px;
						margin: 0 0.5rem;
					`}
				>
					Select Visualization App:
				</h3>
				<p
					css={css`
						font-size: 16px;
						font-weight: 400;
						line-height: 26px;
						margin: 0.5rem;
					`}
				>
					Choose the appropriate app to analyze your selected data.
				</p>
				<div
					css={css`
						display: flex;
						height: 100%;

						.file-container {
							bottom: 10px;
							position: absolute;

							.badge {
								display: inline-flex;
								border: none;
								border-radius: 20px;
								margin: 5px;
								min-width: fit-content;
								padding: 3px 10px;
								background-color: ${theme.colors.accent};
								color: ${theme.colors.white};

								&.disabled {
									background-color: ${theme.colors.grey_6};
								}

								&.format {
									background-color: ${theme.colors.accent_light};
									&.disabled {
										background-color: ${theme.colors.grey_5};
									}
								}
							}
						}

						.visualizer-card {
							background: unset;
							border: 1px solid ${theme.colors.grey_5};
							border-radius: 16px;
							cursor: pointer;
							display: inline-flex;
							font-family: 'Lato', sans-serif;
							margin: 0 0.5rem;
							padding: 10px;
							position: relative;
							width: 33%;

							:disabled {
								cursor: not-allowed;
							}

							p {
								font-weight: 400;
								font-size: 16px;
								line-height: 16px;
								margin-top: 0px;
								text-align: left;
								height: 30%;
							}

							h4 {
								display: inline-block;
								font-size: 18px;
								margin: 0.5rem;
							}

							h5 {
								font-weight: 700;
								font-size: 16px;
								margin: 0.25rem 0;
								text-align: left;
							}
						}

						.logo {
							height: 18px;
							vertical-align: text-bottom;
							width: 18px;
						}

						.preview {
							max-height: 28%;
							overflow-y: hidden;
							width: 100%;

							img {
								width: 100%;
							}
						}
					`}
				>
					<button
						className="visualizer-card"
						disabled={!isJbrowseEnabled}
						onClick={() => {
							// TODO: Add JBrowse & cBio Tables
							setTable(tableTypes['REPO_TABLE']);
							closeModal();
						}}
					>
						<div
							css={css`
								width: 100%;
							`}
						>
							<div className={'preview'}>
								<img src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/jBrowse_Preview.png')} />
							</div>
							<div
								css={css`
									text-align: left;
								`}
							>
								<img className={'logo'} src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/jBrowse_Logo.png')} />
								<h4>JBrowse</h4>
							</div>
							<p>
								A fully featured genome browser that is capable of visualizing diverse types of genome-located data.
							</p>
							<div className={'file-container'}>
								<h5>Files:</h5>
								<div
									css={css`
										display: flex;
									`}
								>
									<div className={`badge ${isJbrowseEnabled ? '' : 'disabled'}`}>5 Max</div>
									<div className={`badge format ${isJbrowseEnabled ? '' : 'disabled'}`}>.VCF</div>
									<div className={`badge format ${isJbrowseEnabled ? '' : 'disabled'}`}>.BAM</div>
								</div>
							</div>
						</div>
					</button>
					<button
						className="visualizer-card"
						disabled={!isIobioEnabled}
						onClick={() => {
							setTable(tableTypes['BAM_TABLE']);
							closeModal();
						}}
					>
						<div
							css={css`
								width: 100%;
							`}
						>
							<div className={'preview'}>
								<img src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/IOBIO_Preview.png')} />
							</div>
							<div
								css={css`
									text-align: left;
								`}
							>
								<img className={'logo'} src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/IOBIO_Logo.png')} />
								<h4>IOBIO</h4>
							</div>
							<p>Examine your sequence alignment file in seconds.</p>
							<div className={'file-container'}>
								<h5>Files:</h5>
								<div
									css={css`
										display: flex;
									`}
								>
									<div className={`badge ${isIobioEnabled ? '' : 'disabled'}`}>1 Max</div>
									<div className={`badge format ${isIobioEnabled ? '' : 'disabled'}`}>.BAM</div>
								</div>
							</div>
						</div>
					</button>
					<button
						className="visualizer-card"
						disabled={!isCBioEnabled}
						onClick={() => {
							// TODO: Add JBrowse & cBio Tables
							setTable(tableTypes['REPO_TABLE']);
							closeModal();
						}}
					>
						<div
							css={css`
								width: 100%;
							`}
						>
							<div className={'preview'}>
								<img src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/cBioPortal_Preview.png')} />
							</div>
							<div
								css={css`
									text-align: left;
								`}
							>
								<img className={'logo'} src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/cBioPortal_Logo.png')} />
								<h4>cBioPortal</h4>
							</div>
							<p>Provides visualization, analysis and download of large-scale cancer genomics data sets.</p>
							<div className={'file-container'}>
								<h5>Files:</h5>
								<div
									css={css`
										display: flex;
									`}
								>
									<div className={`badge ${isCBioEnabled ? '' : 'disabled'}`}>2 Max</div>
									<div className={`badge format ${isCBioEnabled ? '' : 'disabled'}`}>.VCF</div>
									<div className={`badge format ${isCBioEnabled ? '' : 'disabled'}`}>.BAM</div>
								</div>
							</div>
						</div>
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default VisualizerModal;
