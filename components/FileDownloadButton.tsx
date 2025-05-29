import { FC } from 'react';
import Button, { DropdownButton } from './Button';
import FileDownload from './theme/icons/file_download';
type FileDownloadButtonProps = {};

const FileDownloadButton: FC<FileDownloadButtonProps> = () => {
	return (
		<DropdownButton>
			<FileDownload />
			Hello World
		</DropdownButton>
	);
};
export default FileDownloadButton;
