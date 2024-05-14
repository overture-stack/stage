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

import React from 'react';
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
				margin: 48px 48px 48px;
			`}
		>
			{/* Title */}
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
			{/* Conditional rendering based on imageUrl */}
			{imageUrl ? (
				<div
					css={css`
						display: flex;
						flex-direction: column;
					`}
				>
					<div
						css={css`
							box-sizing: border-box;
							color: rgb(0, 48, 85);
							font-size: 16px;
							font-weight: 00;
							line-height: 24px;
							margin-bottom: 24px;
							text-align: justify;
							max-width: 1200px;
						`}
					>
						<p>{text}</p>
						<img
							css={css`
								padding-right: 30px;
								@media (min-width: 1000px) {
									max-width: 50rem;
								}
								max-width: 90%;
								height: auto;
							`}
							src={imageUrl}
							alt={title}
						/>

						{/* Render HTML content */}
						<div
							css={css`
								b {
									font-weight: 900;
								}
							`}
						/>
						{children}
					</div>
				</div>
			) : (
				// If imageUrl is not provided, render just the text
				<div>
					<div
						css={css`
							color: rgb(0, 48, 85);
							font-size: 1em;
							font-weight: 400;
							line-height: 1.5;
							margin-bottom: 24px;
							text-align: justify;
							max-width: 1200px;
						`}
					>
						<p>{text}</p>
						{/* Render HTML content */}
						<div
							css={css`
								code {
									background-color: ${theme.colors.black};
									border-radius: 10px;
									padding: 30px 30px;
									font-family: Lato, Helvetica, Arial, sans-serif;
									font-size: 14px;
									color: ${theme.colors.white};
									display: inline-block;
									margin: 0 5px;
									border: 1px solid ${theme.colors.accent};
								}
							`}
						/>
						{children}
					</div>
				</div>
			)}
		</article>
	);
};

export default ArticleComponent;
