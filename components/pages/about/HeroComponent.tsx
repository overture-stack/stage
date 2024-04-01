import { ReactElement, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import Button from '@/components/Button';
import defaultTheme from '../../theme';
import StyledLink from '@/components/Link';
import overtureOverview from './assets/overview.png';
import heroDemoBannerWide from './assets/herobannerdemo.png';
import ExplorerPage from '@/pages/explorer';
import HeroLink from '@/components/HeroLink';

interface HeroProps {
	setArticleID: (id: string) => void;
}

const HeroComponent = ({ setArticleID }: HeroProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	const handleLinkClick = (id: string) => {
		setArticleID(id);
	};

	return (
		<article
			css={css`
				background-color: ${defaultTheme.colors.grey_2};
				box-sizing: border-box;
				color: ${defaultTheme.colors.white};
				display: flex;
				flex-direction: column;
				align-items: left;
				padding: 50px;
				width: 100%;
				margin-right: 50px;
				background-image: url(${heroDemoBannerWide.src});
				background-repeat: no-repeat;
				background-position: 90% -20%;
				background-size: 900px;

				@media only screen and (max-width: 1800px) {
					background-image: url(${heroDemoBannerWide.src});
					background-position: 90% -110%;
					background-size: 800px;
				}
				@media only screen and (max-width: 1600px) {
					background-image: url(${overtureOverview.src});
					background-position: 95% 150%;
					background-size: 700px;
				}
				@media only screen and (max-width: 1490px) {
					background-image: url(${overtureOverview.src});
					background-position: 110% 50%;
					background-size: 800px;
					margin-right: 1000px;
				}
				@media only screen and (max-width: 900px) {
					background-image: none;
				}
			`}
		>
			<h1
				css={css`
					font-size: 48px;
					font-weight: 900;
					margin-bottom: 20px;
					color: ${theme.colors.accent_dark};
					text-align: left;
				`}
			>
				About this Portal
			</h1>
			<div
				css={css`
					text-align: left;
					max-width: 800px;
					@media only screen and (max-width: 1800px) {
						max-width: 680px;
					}
					@media only screen and (max-width: 1490px) {
						max-width: 400px;
					}
				`}
			>
				<p
					css={css`
						font-size: 22px;
						color: ${theme.colors.accent_dark};
						font-weight: 200;
						text-align: left;
						max-width: 800px;
						line-height: 1.5;
						@media only screen and (max-width: 1800px) {
							max-width: 680px;
						}
						@media only screen and (max-width: 1490px) {
							max-width: 400px;
						}
					`}
				>
					This Overture demo portal is designed as a simple demonstration of our core software
					services. From this page you can find relevant information on the following topics:
				</p>

				<div
					css={css`
						display: flex;
						flex-wrap: wrap;
						margin-top: 20px;
					`}
				>
					<HeroLink onClick={() => setArticleID('usage')}>
						<ul>
							<li>Overture Components</li>
						</ul>
					</HeroLink>
					<HeroLink onClick={() => setArticleID('retrieval')}>
						<ul>
							<li>Retrieving Data</li>
						</ul>
					</HeroLink>
					<HeroLink onClick={() => setArticleID('retrieval')}>
						<ul>
							<li>Submitting Data</li>
						</ul>
					</HeroLink>
					<HeroLink onClick={() => setArticleID('submission')}>
						<ul>
							<li>Data Administration</li>
						</ul>
					</HeroLink>
					<HeroLink onClick={() => setArticleID('overview')}>
						<ul>
							<li>How it's Built</li>
						</ul>
					</HeroLink>
					<HeroLink onClick={() => setArticleID('microservices')}>
						<ul>
							<li>Why use</li>
						</ul>
					</HeroLink>
				</div>
			</div>
		</article>
	);
};

export default HeroComponent;
