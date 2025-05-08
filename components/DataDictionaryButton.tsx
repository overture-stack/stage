import { css } from '@emotion/react';

import { DATA_DICTIONARY_PATH } from '../global/utils/constants';
import { InternalLink as Link } from './Link';

const DataDictionaryButton:React.ComponentType = () => {
	return (
		<div
			css={(theme) => css`
				display: flex;
				align-items: center;
				justify-content: center;
				width: 144px;
				background-color: ${theme.colors.white};
				height: 100%;
				&:hover {
					background-color: ${theme.colors.grey_2};
				}
				border-right: 2px solid ${theme.colors.white};
			`}
		>
			<Link path={DATA_DICTIONARY_PATH}>
				<a
					css={(theme) => css`
						display: flex;
						flex: 1;
						height: 100%;
						justify-content: center;
						align-items: center;
						text-decoration: none;
						color: ${theme.colors.accent_dark};
						cursor: pointer;
					`}
				>
                    Data Dictionary
				</a>
			</Link>
		</div>
	);
};

export default DataDictionaryButton;
