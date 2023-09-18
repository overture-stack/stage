/*
 *
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
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

import Button from '@/components/Button';
import { CustomTooltip } from '@/components/Tooltip';
import { css, Theme, useTheme } from '@emotion/react';
import { TransparentButton } from '@overture-stack/arranger-components/dist/Button';
import { MultiSelectDropDown } from '@overture-stack/arranger-components/dist/DropDown';
import { find } from 'lodash';
import { ButtonWrapper } from '../ActionBar';
import { RepositoryTabNames } from '../RepositoryContent';
import { useTabsContext } from '../TabsContext';
import useJbrowseCompatibility from './useJbrowseCompatibility';

export const getDropdownTheme = (theme: Theme) => ({
	arrowColor: theme.colors.white,
	arrowTransition: 'all 0s',
	background: theme.colors.accent,
	borderColor: theme.colors.accent,
	css: css`
		${theme.typography.subheading2}
		border-width: 1px;
		line-height: 24px;
	`,
	fontColor: theme.colors.white,
	disabledFontColor: theme.colors.grey_5,
	hoverBackground: theme.colors.accent_dark,
	fontSize: '14px',
	padding: '2px 10px',
	ListWrapper: {
		background: theme.colors.white,
		css: css`
			${theme.shadow.default},
		`,
		fontColor: theme.colors.black,
		fontSize: '0.7rem',
		hoverBackground: theme.colors.grey_2,
	},
});

const JbrowseLaunchButton = () => {
	const theme = useTheme();
	const { handleChangeTab, handleOpenTab, openTabs } = useTabsContext();
	const { jbrowseEnabled, jbrowseErrorText, jbrowseLoading } = useJbrowseCompatibility();

	const dropdownTheme = getDropdownTheme(theme);

	return (
		<>
			<MultiSelectDropDown
				theme={{
					...dropdownTheme,
					ListWrapper: {
						...dropdownTheme.ListWrapper,
						css: css`
							left: -2px;
							right: auto !important;
							width: 9em;
							overflow: hidden;
						`,
					},
				}}
				buttonAriaLabelClosed="Open Genome Viewer menu"
				buttonAriaLabelOpen="Close Genome Viewer menu"
				className="genome-viewer-dropdown"
				disabled={false}
				itemSelectionLegend="Select one of the genome viewer options"
				items={['Linear View', 'Circular View']}
				itemToString={(itemLabel, closeDropDownFn) => {
					// on click... close dropdown
					return (
						<TransparentButton
							css={css`
								width: 100%;
							`}
							onClick={() => {
								// set linear or clinical
								// close the dropdown
							}}
						>
							{itemLabel}
						</TransparentButton>
					);
				}}
			>
				Genome Viewer
			</MultiSelectDropDown>
			<CustomTooltip
				disabled={jbrowseEnabled}
				unmountHTMLWhenHide
				arrow
				html={
					<div
						css={css`
							${theme.typography.regular};
							font-size: 12px;
						`}
					>
						{jbrowseErrorText}
					</div>
				}
				position="right"
			>
				<ButtonWrapper>
					<Button
						isLoading={jbrowseLoading}
						css={css`
							padding: 2px 10px;
						`}
						disabled={!jbrowseEnabled}
						onClick={() => {
							// go to jbrowse tab if open, otherwise add jbrowse tab
							if (find(openTabs, { name: RepositoryTabNames.GENOME_VIEWER })) {
								handleChangeTab(RepositoryTabNames.GENOME_VIEWER);
							} else {
								handleOpenTab({ name: RepositoryTabNames.GENOME_VIEWER, canClose: true });
							}
						}}
					>
						<div
							css={css`
								display: flex;
								align-items: center;
							`}
						>
							<span>{RepositoryTabNames.GENOME_VIEWER}</span>
						</div>
					</Button>
				</ButtonWrapper>
			</CustomTooltip>
		</>
	);
};

export default JbrowseLaunchButton;
