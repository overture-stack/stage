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

import ReactModal from 'react-modal';
import { css, useTheme } from '@emotion/react';
import urlJoin from 'url-join';
import { Dismiss } from '../../theme/icons';
import { getConfig } from '../../../global/config';
import { tableTypes } from './constants';

export const VisualizerModal = ({
	closeModal,
	firstRender,
	isModalOpen,
	setTable,
}: {
	closeModal: () => void;
	firstRender: boolean;
	isModalOpen: boolean;
	setTable: (s: string) => void;
}) => {
	const theme = useTheme();
	const { NEXT_PUBLIC_BASE_PATH } = getConfig();
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
					top: '30%',
					left: '25%',
					width: '50%',
					height: '40%',
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

						button {
							display: inline-flex;
							width: 33%;
							background: unset;
							border: 1px solid ${theme.colors.grey_5};
							border-radius: 16px;
							margin: 0 0.5rem;

							h4 {
								font-family: 'Lato', sans-serif;
								font-size: 18px;
								display: inline-block;
							}
						}
					`}
				>
					<button
						onClick={() => {
							setTable(tableTypes['JBROWSE_TABLE']);
							closeModal();
						}}
					>
						<div>
							<div>
								<img src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/jBrowse_Preview.png')} />
							</div>
							<div>
								<img
									css={css`
										width: 18px;
										height: 18px;
									`}
									src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/jBrowse_Logo.png')}
								/>
								<h4>JBrowse</h4>
							</div>
						</div>
					</button>
					<button
						onClick={() => {
							setTable(tableTypes['BAM_TABLE']);
							closeModal();
						}}
					>
						<div>
							<div>
								<img src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/IOBIO_Preview.png')} />
							</div>
							<div>
								<img
									css={css`
										width: 18px;
										height: 18px;
									`}
									src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/IOBIO_Logo.png')}
								/>
								<h4>IOBIO</h4>
							</div>
						</div>
					</button>
					<button
						onClick={() => {
							setTable(tableTypes['CBIO_TABLE']);
							closeModal();
						}}
					>
						<div>
							<div>
								<img src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/cBioPortal_Preview.png')} />
							</div>
							<div>
								<img
									css={css`
										width: 18px;
										height: 18px;
									`}
									src={urlJoin(NEXT_PUBLIC_BASE_PATH, '/images/cBioPortal_Logo.png')}
								/>
								<h4>cBioPortal</h4>
							</div>
						</div>
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default VisualizerModal;
