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
import { File, Screen } from '../../../theme/icons';

export const getToggleButtonStyles = (active: boolean, theme: Theme) => {
	const {
		colors: { accent, white },
	} = theme;
	return `
			background-color: ${active ? white : accent};
			color: ${active ? accent : white};
		`;
};

export const FullScreenButton = ({
	isFullScreen,
	setFullScreen,
	theme,
}: {
	isFullScreen: boolean;
	setFullScreen: (value: SetStateAction<boolean>) => void;
	theme: Theme;
}) => (
	<button
		css={css`
			border: 2px solid ${theme.colors.accent};
			border-radius: 5px;
			display: inline-flex;
			min-width: fit-content;
			padding: 6px;
			position: relative;
			left: -50%;
			${getToggleButtonStyles(isFullScreen, theme)}
		`}
		onClick={() => setFullScreen(!isFullScreen)}
	>
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
	theme,
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
			border: 2px solid ${theme.colors.accent};
			border-radius: 5px;
			display: inline-flex;
			padding: 6px;
			${getToggleButtonStyles(isFileTableActive, theme)}
			:disabled {
				background-color: ${theme.colors.grey_1};
				border: 2px solid ${theme.colors.grey_4};
				color: ${theme.colors.grey_4};
			}
		`}
		onClick={switchTable}
	>
		{isFileTableActive ? (
			<span>
				<File
					fill={iconColor}
					style={css`
						vertical-align: middle;
					`}
				/>{' '}
				Files
			</span>
		) : (
			<span>
				<Screen
					fill={iconColor}
					style={css`
						vertical-align: middle;
					`}
				/>{' '}
				Visualization
			</span>
		)}
	</button>
);
