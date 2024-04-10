import React from 'react';
import { css, useTheme } from '@emotion/react';

interface ArticleProps {
	title?: string;
	text: string;
	imageUrl?: string;
	htmlContent?: string;
}

const ArticleComponent = ({ title, text, imageUrl, htmlContent }: ArticleProps) => {
	const theme = useTheme();

	return (
		<article
			css={css`
				box-sizing: border-box;
				border-radius: 5px;
				padding: 0px 60px 0px 60px;
				background-color: ${theme.colors.white};
			`}
		>
			{/* Title */}
			<h1
				css={css`
					color: ${theme.colors.accent};
					font-size: 26px;
					font-weight: normal;
				`}
			>
				{title}
			</h1>
			{/* Conditional rendering based on imageUrl */}
			{imageUrl ? (
				// If imageUrl is provided, render the image and text side by side
				<div
					css={css`
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						@media (max-width: 1280px) {
							flex-direction: column;
						}
					`}
				>
					<div
						css={css`
							flex: 2;
							padding-right: 30px;
						`}
					>
						<img
							css={css`
								@media (max-width: 1279px) and (min-width: 1000px) {
									max-width: 70%;
								}
								width: 100%;
								height: auto;
							`}
							src={imageUrl}
							alt={title}
						/>
					</div>
					<div
						css={css`
							flex: 2;
						`}
					>
						<div
							css={css`
								line-height: 1.5;
								font-size: 16px;
								font-weight: 200;
								text-align: justify;
							`}
						>
							<p>{text}</p>
							{/* Render HTML content */}
							<div
								css={css`
									strong {
										font-weight: 900;
									}
									code {
										background-color: ${theme.colors.black};
										border-radius: 10px;
										padding: 30px 30px;
										font-family: 'Courier New', Courier, monospace;
										font-size: 14px;
										color: ${theme.colors.white};
										display: inline-block;
										margin: 0 5px;
										border: 1px solid ${theme.colors.accent};
									}
								`}
								dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
							/>
						</div>
					</div>
				</div>
			) : (
				// If imageUrl is not provided, render just the text
				<div>
					<div
						css={css`
							line-height: 1.5;
							font-size: 16px;
							font-weight: 200;
							text-align: justify;
						`}
					>
						<p>{text}</p>
						{/* Render HTML content */}
						<div
							css={css`
								strong {
									font-weight: 900;
								}
								code {
									background-color: ${theme.colors.black};
									border-radius: 10px;
									padding: 30px 30px;
									font-family: 'Courier New', Courier, monospace;
									font-size: 14px;
									color: ${theme.colors.white};
									display: inline-block;
									margin: 0 5px;
									border: 1px solid ${theme.colors.accent};
								}
							`}
							dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
						/>
					</div>
				</div>
			)}
		</article>
	);
};

export default ArticleComponent;
