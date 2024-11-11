import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';
import defaultTheme from '../../theme';
import Link from 'next/link';
import { StyledLinkAsButton } from '@/components/Link';

const Impact = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();
	return (
		<section
			css={css`
				margin: 0 50px;

				> * {
					margin: 25px 0;
				}

				@media (min-width: 900px) {
					max-width: calc(50% - 75px);
					margin-right: 25px;
				}
			`}
		>
			<h2
				css={css`
					color: ${theme.colors.primary};
					font-size: 26px;
					font-weight: normal;
					position: relative;
				`}
			>
				Next Steps
			</h2>

			<ul>
				<li>Demo the proof of concept</li>
				<li>Review existing datasets/data structures</li>
				<li>Identify pain points in the current POC</li>
				<li>Identify functional requirements</li>
				<li>Prioritize development requirements</li>
				<li>Clarify dataset requirements</li>
			</ul>
			<p>These points will be addressed in our next meeting, document linked below:</p>

			<StyledLinkAsButton
				css={css`
					${theme.typography.button};
					background-color: ${theme.colors.primary};
					border-color: ${theme.colors.primary};
					line-height: 20px;
					margin-right: 15px;
					padding: 8px 20px;
					width: fit-content;

					&:hover {
						color: ${theme.colors.white};
						background-color: ${theme.colors.accent};
					}
				`}
				target="_blank"
				rel="noopener noreferrer"
				href="https://docs.google.com/document/d/1W6Ww0nNq7h1lwmklWEgh7ZEzya3TGVFwxZ5uCjT-lXU/edit?usp=sharing"
			>
				Click here to view the meeting Doc
			</StyledLinkAsButton>
		</section>
	);
};

export default Impact;
