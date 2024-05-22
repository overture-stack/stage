/*
 *
 * 	Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
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

import React, { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';
import defaultTheme from '../../theme';
import HeroLink from '@/components/HeroLink';

type HeroProps = {
	setArticleID: (id: string) => void;
	activeId: string | null;
};

const HeroComponent = ({ setArticleID, activeId }: HeroProps): ReactElement => {
	const theme = useTheme();

	return (
		<div
			css={css`
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 60px;
				background-color: ${defaultTheme.colors.grey_2};
				height: 350px;
				}
			`}
		>
			<article
				css={css`
					width: 100%;
					max-width: 1200px;
					padding: 0 48px;
					box-sizing: border-box;
				`}
			>
				<h1
					css={css`
						font-size: 30px;
						font-weight: 400;
						line-height: 36px;
						margin-bottom: 44px;
						color: rgb(0, 48, 85);
					`}
				>
					Disclaimer
				</h1>
				<div
					css={css`
						text-align: left;
					`}
				>
					<p
						css={css`
							font-size: 16px;
							color: rgb(0, 48, 85);
							font-weight: 400;
							text-align: left;
							line-height: 24px;
							margin-bottom: 24px;
							@media (min-width: 1450px) {
								max-width: 1200px;
							}
						`}
					>
						This demo platform and its data are intended for demo purposes only. The data presented
						does not represent real or operational information and should not be used for any actual
						decision-making or analysis.
					</p>
					<div
						css={css`
							display: flex;
							flex: 1;
							flex-direction: row;
							justify-content: space-between;
							max-width: 700px;
							padding-top: 15px;
							@media only screen and (max-width: 1100px) {
								flex-direction: column;
								align-items: flex-start;
							}
						`}
					>
						<a onClick={() => setArticleID('data')}>
							<HeroLink
								css={css`
									color: ${activeId === 'data' ? theme.colors.accent2 : ''};
									padding-right: 10px;
									&:hover {
										color: ${theme.colors.accent2};
										text-decoration: underline;
									}
								`}
							>
								Data Disclaimer
							</HeroLink>
						</a>
						<a onClick={() => setArticleID('terms')}>
							<HeroLink
								css={css`
									color: ${activeId === 'terms' ? theme.colors.accent2 : ''};
									padding-right: 10px;
									&:hover {
										color: ${theme.colors.accent2};
										text-decoration: underline;
									}
								`}
							>
								Terms & Conditions
							</HeroLink>
						</a>
						<a onClick={() => setArticleID('privacy')}>
							<HeroLink
								css={css`
									color: ${activeId === 'privacy' ? theme.colors.accent2 : ''};
									padding-right: 10px;
									&:hover {
										color: ${theme.colors.accent2};
										text-decoration: underline;
									}
								`}
							>
								Privacy Statement
							</HeroLink>
						</a>
					</div>
				</div>
			</article>
		</div>
	);
};

export default HeroComponent;
