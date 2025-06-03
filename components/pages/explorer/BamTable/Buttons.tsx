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

import { css, Theme } from '@emotion/react';
import { SetStateAction } from 'react';
import { ChevronDown, FullScreen, OncoJS } from '../../../theme/icons';

export const getToggleButtonStyles = (active: boolean, accent: string, white: string) => `
			border: 2px solid ${accent};
			border-radius: 5px;
			display: inline-flex;
			min-width: fit-content;
			padding: 6px;
			background-color: ${active ? white : accent};
			color: ${active ? accent : white};
		`;

export const FullScreenButton = ({
	isFullScreen,
	setFullScreen,
	theme: {
		colors: { accent, white },
	},
}: {
	isFullScreen: boolean;
	setFullScreen: (value: SetStateAction<boolean>) => void;
	theme: Theme;
}) => (
	<button
		css={css`
			position: relative;
			right: 50%;
			${getToggleButtonStyles(isFullScreen, accent, white)}
		`}
		onClick={() => setFullScreen(!isFullScreen)}
	>
		<FullScreen
			width={16}
			height={16}
			fill={white}
			style={css`
				vertical-align: middle;
			`}
		/>{' '}
		Full Screen
	</button>
);

/* TODO: In current state, this button should not be disabled when Bam Visualizer is active 
  to allow navigation back to File Table.
  Final UI mockups will change how navigation and disabled states are handled.
*/
export const BamFileButton = ({
	iconColor,
	isBamFileSelected,
	isFileTableActive,
	switchTable,
	theme: {
		colors: { accent2, grey_1, grey_4, white },
	},
}: {
	iconColor: string;
	isBamFileSelected: boolean;
	isFileTableActive: boolean;
	switchTable: () => void;
	theme: Theme;
}) => (
	<button
		disabled={!isBamFileSelected && isFileTableActive}
		css={css`
			${getToggleButtonStyles(false, accent2, white)}
			:disabled {
				background-color: ${grey_1};
				border: 2px solid ${grey_4};
				color: ${grey_4};
			}
		`}
		onClick={switchTable}
	>
		{isFileTableActive ? (
			<span>
				<OncoJS
					width={16}
					height={16}
					fill={iconColor}
					style={css`
						vertical-align: middle;
					`}
				/>{' '}
				Visualization
			</span>
		) : (
			<span>
				<ChevronDown
					fill={iconColor}
					width={10}
					height={10}
					style={css`
						transform: rotate(-90deg);
						vertical-align: middle;
					`}
				/>{' '}
				File Repository
			</span>
		)}
	</button>
);
