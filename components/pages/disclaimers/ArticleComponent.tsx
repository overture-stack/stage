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

import { css, useTheme } from '@emotion/react';

type ArticleProps = {
	title: string;
	text: string;
	imageUrl?: string;
	children?: React.ReactNode;
};

const ArticleComponent = ({ title, text, imageUrl, children }: ArticleProps) => {
	const theme = useTheme();

	return (
		<article
			css={css`
				margin: 48px 20px;
				li {
					margin-bottom: 28px;
				}
			`}
		>
			<h1
				css={css`
					position: relative;
					color: rgb(0, 48, 85);
					font-size: 20px;
					line-height: 30px;
					font-weight: 700;
					margin-bottom: 40px;
					&:after {
						content: '';
						position: absolute;
						bottom: -12px;
						display: block;
						height: 3px;
						width: 106px;
						border-radius: 1.5px;
						background-color: #f2d021;
					}
				`}
			>
				{title}
			</h1>
			{imageUrl ? (
				<div>
					<p
						css={css`
							color: rgb(0, 48, 85);
							font-size: 16px;
							font-weight: 400;
							line-height: 24px;
							margin-bottom: 24px;
							text-align: justify;
							max-width: 1200px;
						`}
					>
						{text}
					</p>
					<div
						css={css`
							display: flex;
							justify-content: center;
							align-items: center;
						`}
					>
						<img
							css={css`
								height: auto;
								max-width: 100%;
							`}
							src={imageUrl}
							alt={title}
						/>
					</div>

					{children}
				</div>
			) : (
				<div
					css={css`
						color: rgb(0, 48, 85);
						font-size: 16px;
						font-weight: 400;
						line-height: 24px;
						margin-bottom: 24px;
						text-align: justify;
						max-width: 1200px;
					`}
				>
					<p>{text}</p>
					{children}
				</div>
			)}
		</article>
	);
};

export default ArticleComponent;
