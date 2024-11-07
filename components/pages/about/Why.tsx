import { ReactElement } from 'react';
import { css } from '@emotion/react';

const WhySequence = (): ReactElement => (
	<section
		css={(theme) => css`
			margin: 0 50px;

			> * {
				margin: 25px 0;
			}

			@media (min-width: 900px) {
				max-width: calc(65% - 75px);
				margin-left: 25px;
			}

			@media (min-width: 960px) {
				max-width: calc(60% - 75px);
			}
		`}
	>
		<h2
			css={(theme) => css`
				color: ${theme.colors.primary};
				font-size: 26px;
				font-weight: normal;
				position: relative;
				text-align: center;
			`}
		>
			Lorem Ipsum Dolor Sit
		</h2>

		<figure
			css={(theme) => css`
				display: flex;
				flex-wrap: wrap;
				max-width: 744px;

				figcaption {
					${theme.typography.label};
					flex-basis: calc(33% - 20px);
					padding: 10px;
					text-align: center;
				}
			`}
		>
			{/* <img src="images/about-why_sequence.png" alt="placeholder image" width="100%" style={{ maxHeight: '200px' }} /> */}
			<figcaption>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
			</figcaption>
			<figcaption>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.</figcaption>
			<figcaption>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</figcaption>
		</figure>
	</section>
);

export default WhySequence;
