import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';

import defaultTheme from '../../theme';
import StyledLink, { StyledLinkAsButton, InternalLink as Link } from '../../Link';
import { EXPLORER_PATH } from '@/global/utils/constants';
import overtureOverview from './assets/overview.png';
import heroDemoBannerWide from './assets/herobannerdemo.png'

const HeroBanner = ({updateFunction}): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

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
				<div
					css={css`
						display: flex;
						justify-content: left;
						align-items: left;
					`}
				>
				</div>
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
					justify-content: left;
					margin-top: 20px;
				`}
			>
						<Link path={EXPLORER_PATH}>
							<StyledLink
								css={css`
									${theme.typography.button};
									margin: 10px;
								`}
							>
								> How it's used
							</StyledLink>
						</Link>
						
						
						<Link path={EXPLORER_PATH}>
							<StyledLink
								css={css`
									${theme.typography.button};
									margin: 10px;
								`}
							>
								> How it's built
							</StyledLink>
						</Link>
				<Link path={EXPLORER_PATH}>
					<StyledLink
						css={css`
							${theme.typography.button};
							margin: 10px;
						`}
					>
						> How it's deployed
					</StyledLink>
				</Link>
			<a onClick={() => {updateFunction("how-to-use-it")}}>Click here</a>
			</div>

		</article>
	);
};

export default HeroBanner;
