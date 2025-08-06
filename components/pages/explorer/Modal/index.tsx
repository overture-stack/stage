/*
 *
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import { useEffect, ReactNode } from 'react';
import ReactModal from 'react-modal';
import { css, useTheme } from '@emotion/react';
import { Dismiss } from '../../../theme/icons';

// Encapsulates the 3rd party component, base layout, and if modal is open
const ModalContainer = ({
	children,
	appRootId,
	isModalOpen,
	closeModal,
	errorMessage,
}: {
	children: ReactNode;
	closeModal: () => void;
	appRootId: string;
	isModalOpen: boolean;
	errorMessage?: string;
}) => {
	useEffect(() => {
		ReactModal.setAppElement(appRootId);
	}, []);

	const theme = useTheme();

	return (
		<ReactModal
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
							background: none;
							border: none;
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
					`}
				>
					{children}
				</div>
				<p
					css={css`
						color: #ad404e;
						font-size: 14px;
						font-weight: 500;
						min-height: 14px;
						line-height: 14px;
						margin: 0.75rem 0.5rem;
					`}
				>
					{errorMessage && errorMessage?.length > 1 ? errorMessage : ''}
				</p>
			</div>
		</ReactModal>
	);
};

export default ModalContainer;
