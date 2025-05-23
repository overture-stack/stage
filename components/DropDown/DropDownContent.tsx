import { FC } from 'react';
import { DropDownContentProps } from './types';

const DropDownContent: FC<DropDownContentProps> = ({ children, label, disabled }) => {
	return <>{!disabled && (children || label)}</>;
};

export default DropDownContent;
