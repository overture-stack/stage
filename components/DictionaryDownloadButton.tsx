import { css, useTheme } from '@emotion/react';
import { FC, useState } from 'react';
import FileDownload from './theme/icons/file_download';
import Button from './Button';

export const actionItemStyle = (theme: any, width?: string) => css`
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: space-between;
	gap: 11px;
	min-width: ${width || '200px'};
	max-width: 400px;
	width: 100%;
	padding: 8px;
	background-color: #f7f7f7;
	color: ${theme.colors.black};
	border: 1px solid #beb2b294;
	border-radius: 9px;
	font-size: 14px;
	height: 43px;
	box-sizing: border-box;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: ${theme.colors.grey_1};
	}

	span,
	div {
		display: flex;
		align-items: center;
		font-weight: 400;
		gap: 8px;
		font-size: 16px;
		line-height: 1.2;
		color: ${theme.colors.accent_dark};
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

type DictionaryDownloadButtonProps = {
	version: string;
	name: string;
	lecternUrl: string;
	fileType?: 'tsv' | 'csv';
};

const DictionaryDownloadButton: FC<DictionaryDownloadButtonProps> = ({
	version,
	name,
	lecternUrl,
	fileType = 'tsv',
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const theme = useTheme();

	const fetchUrl = `${lecternUrl}/dictionaries/template/download?${new URLSearchParams({
		name,
		version,
		fileType,
	})}`;

	const downloadDictionary = async () => {
		try {
			setIsLoading(true);
			const res = await fetch(fetchUrl);

			if (!res.ok) {
				throw new Error(`Failed with status ${res.status}`);
			}

			const blob = await res.blob();
			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = `${name}_${version}_templates.zip`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading dictionary:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button css={actionItemStyle(theme)} onClick={downloadDictionary} disabled={isLoading}>
			<FileDownload />
			<span>Submission Templates</span>
		</Button>
	);
};

export default DictionaryDownloadButton;
