import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';
import defaultTheme from '../../theme';

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
					max-width: calc(35% - 75px);
					margin-right: 25px;
				}

				@media (min-width: 960px) {
					max-width: calc(40% - 75px);
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
				Lorem Ipsum Dolor
			</h2>

			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
				magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
				consequat.
			</p>

			<ul>
				<li>Duis aute irure dolor in reprehenderit</li>
				<li>Voluptate velit esse cillum dolore</li>
				<li>Excepteur sint occaecat cupidatat</li>
				<li>Sunt in culpa qui officia deserunt</li>
				<li>Nemo enim ipsam voluptatem quia</li>
				<li>Quis autem vel eum iure reprehenderit</li>
			</ul>
		</section>
	);
};

export default Impact;
