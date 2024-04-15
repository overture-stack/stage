import React from 'react';
import { css, useTheme } from '@emotion/react';

interface ArticleProps {
	title?: string;
	text: string;
	imageUrl?: string;
	htmlContent?: string;
	children?: React.ReactNode;
}

const ArticleComponent = ({ title, text, imageUrl, children }: ArticleProps) => {
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
					font-size: 22px;
					font-weight: normal;
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
							line-height: 1.5;
							font-size: 14px;
							font-weight: 200;
							text-align: justify;
							max-width: 1000px;
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
								strong {
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
							line-height: 1.5;
							font-size: 14px;
							font-weight: 200;
							text-align: justify;
							max-width: 1000px;
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
						/>
						{children}
					</div>
				</div>
			)}
		</article>
	);
};

export default ArticleComponent;
