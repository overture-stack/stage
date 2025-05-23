import { FC } from 'react';
import { StyledListItemStyle } from './styles';
import { DropDownItemProps } from './types';

const DropDownItem: FC<DropDownItemProps> = ({ children, label, disabled, link }) => {
	if (disabled) {
		return <a>{label}</a>;
	}
	if (children) {
		return <>{children}</>;
	}
	return (
		<a href={link} css={StyledListItemStyle}>
			{label}
		</a>
	);
};

export default DropDownItem;
