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

import { css, Theme } from '@emotion/react';
import { SetStateAction } from 'react';
import { ChevronDown, FullScreen, BarGraph } from '../../theme/icons';

export const getToggleButtonStyles = ({
	active,
	accent,
	white,
}: {
	active: boolean;
	accent: string;
	white: string;
}) => `
			border: 1px solid ${accent};
			border-radius: 0.5rem;
			display: inline-flex;
			min-width: fit-content;
			padding: 0.5rem 0.8rem;
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
			${getToggleButtonStyles({ active: isFullScreen, accent, white })}
		`}
		onClick={() => setFullScreen(!isFullScreen)}
	>
		<span>
			<FullScreen
				width={16}
				height={16}
				style={css`
					vertical-align: bottom;
				`}
			/>{' '}
			Full Screen
		</span>
	</button>
);

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
			${getToggleButtonStyles({ active: false, accent: accent2, white })}
			:disabled {
				background-color: ${grey_1};
				border: 1px solid ${grey_4};
				color: ${grey_4};
			}
		`}
		onClick={switchTable}
	>
		{isFileTableActive ? (
			<span>
				<BarGraph
					width={16}
					height={16}
					fill={iconColor}
					style={css`
						vertical-align: bottom;
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
						transform: rotate(90deg);
					`}
				/>{' '}
				File Repository
			</span>
		)}
	</button>
);
