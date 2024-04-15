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

import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';
import defaultTheme from '../../theme';
import overtureOverview from './assets/emblemNoBackground.png';
import heroDemoBannerWide from './assets/herobannerdemo.png';
import HeroLink from '@/components/HeroLink';

type HeroProps = {
	setArticleID: (id: string) => void;
	activeId: string | null;
};

const HeroComponent = ({ setArticleID, activeId }: HeroProps): ReactElement => {
	const theme = useTheme();

	return (
		<article
			css={css`
				background-color: ${defaultTheme.colors.grey_2};
				color: ${defaultTheme.colors.white};
				padding: 60px;
				background-image: url(${heroDemoBannerWide.src});
				background-repeat: no-repeat;
				background-position: 95% -190%;
				background-size: 800px;
				height: 350px;
				@media only screen and (max-width: 1711px) {
					background-image: url(${overtureOverview.src});
					background-position: 80% 50%;
					background-size: 30vw;
				@media only screen and (max-width: 900px) {
					background-image: none;
				}
			`}
		>
			<h1
				css={css`
					font-size: 48px;
					font-weight: 900;
					color: ${theme.colors.accent_dark};
				`}
			>
				About this Portal
			</h1>
			<div
				css={css`
					text-align: left;
					max-width: 50%;
					@media only screen and (max-width: 900px) {
						max-width: 100%;
					}
				`}
			>
				<p
					css={css`
						font-size: 18px;
						color: ${theme.colors.black};
						font-weight: 200;
						text-align: left;
						line-height: 1.5;
						@media (min-width: 1450px) {
							max-width: 1200px;
					`}
				>
					Welcome to our Demo portal. We've designed this portal specifically to assist new users in
					getting acquainted with Overture. From this page you can find basic information on the
					following topics:
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
					{/* Add links here */}
					<a onClick={() => setArticleID('overview')}>
						<HeroLink
							css={css`
								color: ${activeId === 'overview' ? theme.colors.accent2 : ''};
								padding-right: 10px;
								&:hover {
									color: ${theme.colors.accent2};
									text-decoration: underline;
								}
							`}
						>
							Demo Portal Overview
						</HeroLink>
					</a>
					<a onClick={() => setArticleID('usage')}>
						<HeroLink
							css={css`
								color: ${activeId === 'usage' ? theme.colors.accent2 : ''};
								padding-right: 10px;
								&:hover {
									color: ${theme.colors.accent2};
									text-decoration: underline;
								}
							`}
						>
							Data Retrieval & Submission
						</HeroLink>
					</a>
					<a onClick={() => setArticleID('build')}>
						<HeroLink
							css={css`
								color: ${activeId === 'build' ? theme.colors.accent2 : ''};
								padding-right: 10px;
								&:hover {
									color: ${theme.colors.accent2};
									text-decoration: underline;
								}
							`}
						>
							Administration & Portal Configuration
						</HeroLink>
					</a>
				</div>
			</div>
		</article>
	);
};

export default HeroComponent;
