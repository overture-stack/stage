import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';
import defaultTheme from '../../theme';
import overtureOverview from './assets/portal-hero.png';
import heroDemoBannerWide from './assets/herobannerdemo.png';
import HeroLink from '@/components/HeroLink';

interface HeroProps {
	setArticleID: (id: string) => void;
	activeId?: string;
}

const HeroComponent = ({ setArticleID, activeId = 'overview' }: HeroProps): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<article
			css={css`
				background-color: ${defaultTheme.colors.grey_2};
				color: ${defaultTheme.colors.white};
				padding: 60px;
				background-image: url(${heroDemoBannerWide.src});
				background-repeat: no-repeat;
				background-position: 90% -210%;
				background-size: 800px;
				height: 350px;

				@media only screen and (max-width: 2000px) {
					background-image: url(${heroDemoBannerWide.src});
					background-position: 95% -210%;
					background-size: 800px;
				}
				@media only screen and (max-width: 1711px) {
					background-image: url(${overtureOverview.src});
					background-position: 95% 150%;
					background-size: 700px;
				}
				@media only screen and (max-width: 1550px) {
					background-image: url(${overtureOverview.src});
					background-position: 130% 50%;
					background-size: 55vw;
				}
				@media only screen and (max-width: 1235px) {
					background-image: url(${overtureOverview.src});
					background-position: 140% 50%;
					background-size: 60vw;
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
						color: ${theme.colors.accent_dark};
						font-weight: 200;
						text-align: left;
						line-height: 1.5;
					`}
				>
					The Overture demo portal is designed as a simple demonstration of our core software
					services. From this page you can find relevant information on the following topics:
				</p>
				<div
					css={css`
						display: flex;
						flex: 1;
						flex-direction: row;
						justify-content: space-between;
						max-width: 700px;
						@media only screen and (max-width: 900px) {
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
							Data Retrieval and Submission
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
							Data Administration & Portal Configuration
						</HeroLink>
					</a>
				</div>
			</div>
		</article>
	);
};

export default HeroComponent;
