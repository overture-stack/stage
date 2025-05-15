import React from 'react';
import { css } from '@emotion/react';
import colours from './styles/colours';

type DictionaryHeaderProps = {
	description: string;
	name: string;
};

const DictionaryHeader: React.ComponentType<DictionaryHeaderProps> = ({ description, name }) => {
	return (
		<div
			css={css`
				background-color: ${colours.accent1_1};
				display: flex;
				flex-direction: column;
				width: 100%;
				margin-bottom: 1rem;
				padding: 2.5rem;
				max-height: 10%;
				align-items: flex-start;
			`}
		>
			<div
				css={css`
					display: flex;
					flex-direction: column;
				`}
			>
				<h1
					css={css`
						font-weight: 700;
						font-size: 40px;
						color: white;
						line-height: 100%;
						margin: 0.5rem 0;
					`}
				>
					{name}
				</h1>
				<p
					css={css`
						color: white;
						margin: 0;
					`}
				>
					{description}
				</p>
			</div>
		</div>
	);
};

export default DictionaryHeader;
