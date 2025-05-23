import { ReactChildren, ReactElement, ReactNode } from 'react';

export type DropDownProps = {
	title?: string;
	disabled?: boolean;
	MenuItemMap?: Map<string, string>;
	children?: ReactNode | ReactChildren;
};

export type DropDownItemProps = {
	link?: string;
	label: string;
	disabled?: boolean;
	children?: ReactElement<DropDownContentProps> | ReactNode;
};

export type DropDownContentProps = {
	label?: string;
	disabled?: boolean;
	children?: ReactNode | ReactChildren;
};
