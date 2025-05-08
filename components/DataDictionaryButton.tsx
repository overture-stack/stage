import { css, useTheme } from '@emotion/react';
import { useRouter } from 'next/router';
import { DATA_DICTIONARY_PATH } from '../global/utils/constants';
import { InternalLink as Link } from './Link';
import defaultTheme from './theme';

const DataDictionaryButton: React.ComponentType = () => {
	const router = useRouter();
	const theme: typeof defaultTheme = useTheme();
	const activeLinkStyle = `
    background-color: ${theme.colors.grey_2};
    color: ${theme.colors.accent2_dark};
	`;
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
						${router.pathname === DATA_DICTIONARY_PATH ? activeLinkStyle : ''}
					`}
				>
					Data Dictionary
				</a>
			</Link>
		</div>
	);
};

export default DataDictionaryButton;
