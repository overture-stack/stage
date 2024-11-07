/*
 *
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
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

import { INTERNAL_PATHS } from '../../../global/utils/constants';
import defaultTheme from '../../theme';
import { StyledLinkAsButton, InternalLink as Link } from '../../Link';

/** Layout notes:
  - Article is the full-width background for the hero banner
  - Section centers the content in larger screens
 ** */

const HeroBanner = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<article
			css={css`
				background-color: ${theme.colors.primary_dark};
				box-sizing: border-box;
				color: ${theme.colors.white};
				display: flex;
				padding: 50px 50px;
				width: 100%;

				@media (min-width: 1270px) {
					height: 400px;
				}

				@media (min-width: 2165px) {
					padding-left: 50px;
					justify-content: center;
				}

				@media (min-width: 2170px) {
				}

				@media (min-width: 2880px) {
					padding-left: 50px;
				}
			`}
		>
			<section
				css={css`
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					max-width: 1550px;
					width: 100%;

					> * {
						margin: 0;

						&:not(h1) {
							margin-top: 20px;
						}
					}
				`}
			>
				<h1
					css={css`
						font-size: 30px;
						font-weight: normal;
						position: relative;

						@media (min-width: 1345px) {
							font-size: 34px;
						}
					`}
				>
					Drug Discovery Proof of Concept
				</h1>

				<p
					css={css`
						${theme.typography.subheading}
						font-weight: normal;
					`}
				>
					The initial phase of our project focuses on building a simple data portal that displays our dataset through
					the front-end interface. Once this foundation is in place, we can progressively enhance the portal's
					functionality to support the specific requirements and workflows of our drug discovery team.
				</p>

				<div
					css={css`
						display: flex;
					`}
				>
					<Link path={INTERNAL_PATHS.EXPLORER}>
						<StyledLinkAsButton
							css={css`
								${theme.typography.button};
								background-color: ${theme.colors.black};
								border-color: ${theme.colors.black};
								line-height: 20px;
								margin-right: 15px;
								padding: 8px 20px;
								width: fit-content;

								&:hover {
									color: ${theme.colors.white};
									background-color: ${theme.colors.grey_6};
								}
							`}
						>
							Explore the Data
						</StyledLinkAsButton>
					</Link>
				</div>
			</section>
		</article>
	);
};

export default HeroBanner;
