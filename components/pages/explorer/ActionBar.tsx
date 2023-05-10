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
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import {
	ColumnsSelectButton,
	DownloadButton,
	getDisplayName,
} from '@overture-stack/arranger-components';

const ButtonWrapper = styled('div')`
	margin-left: 0.3rem;
	margin-bottom: 0.3rem;
`;

const ActionBar = () => {
	const theme = useTheme();
	return (
		<div
			className="buttons"
			css={css`
				display: flex;
				list-style: none;
				margin: 0 0 0 -0.3rem;
				justify-content: space-between;
				align-items: center;
				padding: 0;
			`}
		>
			<CustomTooltip
				unmountHTMLWhenHide
				arrow
				html={
					<div
						css={css`
							${theme.typography.regular};
							font-size: 12px;
						`}
					>
						Please select a minimum of 1 file to launch JBrowse.
						<br />
						Only .BAM & .VCF file types are supported.
					</div>
				}
				position="right"
			>
				<ButtonWrapper>
					<Button
						css={css`
							padding: 2px 10px;
						`}
						disabled
					>
						<div
							css={css`
								display: flex;
								align-items: center;
							`}
						>
							<img
								src="images/jbrowse-logo.png"
								alt=""
								width={16}
								css={css`
									margin-right: 0.3rem;
								`}
							/>
							<span>Jbrowse</span>
						</div>
					</Button>
				</ButtonWrapper>
			</CustomTooltip>
			<div
				css={css`
					display: flex;
				`}
			>
				{[ColumnsSelectButton, DownloadButton].map((Component) => (
					<ButtonWrapper key={getDisplayName(Component)}>
						<Component />
					</ButtonWrapper>
				))}
			</div>
		</div>
	);
};

export default ActionBar;
