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
import { ChevronDown, FullScreen, BarGraph } from '../../theme/icons';
import { tableTypes } from './constants';

export const getHeaderButtonStyles = ({ active, accent }: { active: boolean; accent: string }) => {
	const {
		colors: { white },
	} = useTheme();
	return `
			border: 1px solid ${accent};
			border-radius: 0.5rem;
			display: inline-flex;
			font-size: 14px;
			line-height: 1.3rem;
			min-width: fit-content;
			padding: 0.3rem 0.8rem;
			background-color: ${active ? white : accent};
			color: ${active ? accent : white};
		`;
};

export const FullScreenButton = ({
	isFullScreen,
	setFullScreen,
}: {
	isFullScreen: boolean;
	setFullScreen: () => void;
}) => {
	const {
		colors: { accent, white },
	} = useTheme();
	return (
		<button
			css={css`
				path {
					fill: ${isFullScreen ? accent : white};
				}
				position: relative;
				right: 50%;
				transform: translate(50%);
				${getHeaderButtonStyles({ active: isFullScreen, accent })};
			`}
			onClick={setFullScreen}
		>
			<span>
				<FullScreen
					width={16}
					height={16}
					style={css`
						vertical-align: text-bottom;
					`}
				/>{' '}
				Full Screen
			</span>
		</button>
	);
};

export const VisualizerButton = ({
	iconColor,
	isBamFileSelected,
	isFileTableActive,
	switchTable, // change to open modal
}: {
	iconColor: string;
	isBamFileSelected: boolean;
	isFileTableActive: boolean;
	switchTable: (t: string) => void;
}) => {
	const {
		colors: { accent2, grey_1, grey_4 },
	} = useTheme();
	return (
		<button
			disabled={!isBamFileSelected && isFileTableActive}
			css={css`
				${getHeaderButtonStyles({ active: false, accent: accent2 })}
				:disabled {
					background-color: ${grey_1};
					border: 1px solid ${grey_4};
					color: ${grey_4};
					path {
						fill: ${grey_4};
					}
				}
			`}
			onClick={() => switchTable(tableTypes['BAM_TABLE'])}
		>
			<span>
				<BarGraph
					width={16}
					height={16}
					fill={iconColor}
					style={css`
						vertical-align: text-bottom;
					`}
				/>{' '}
				Visualization
			</span>
		</button>
	);
};

export const FileButton = ({ switchTable }: { switchTable: (t: string) => void }) => {
	const {
		colors: { accent2, white },
	} = useTheme();
	return (
		<button
			css={css`
				${getHeaderButtonStyles({ active: false, accent: accent2 })}
			`}
			onClick={() => switchTable(tableTypes['REPO_TABLE'])}
		>
			<span>
				<ChevronDown
					fill={white}
					width={10}
					height={10}
					style={css`
						transform: rotate(90deg);
					`}
				/>{' '}
				File Repository
			</span>
		</button>
	);
};
