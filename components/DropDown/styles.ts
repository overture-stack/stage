import { css } from '@emotion/react';

export const ParentStyle = css`
	position: relative;
	display: inline-block;
`;
export const DropDownTitleStyle = (theme: any) => css`
	padding: 5px 10px;
	font-weight: bold;
	color: ${theme.colors.accent_dark};
`;
export const ChevronStyle = (open: boolean) => css`
	transform: ${open ? 'rotate(180deg)' : 'none'};
	transition: transform 0.2s ease;
`;
export const DropdownMenuStyle = (theme: any) => css`
	position: absolute;
	top: calc(100% + 5px);
	left: 0;
	width: max-content;
	min-width: 160px;
	background-color: ${theme.colors.white};
	box-shadow: 0 8px 21px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
	list-style: none;
	margin: 0;
	padding: 0;
	z-index: 1000;
`;
export const StyledListItemStyle = (theme: any) => css`
	display: flex;
	align-items: center;
	width: 100%;
	padding: 6px 12px;
	font-size: 16px;
	color: ${theme.colors.black};
	background-color: ${theme.colors.white};
	border: 1px solid ${theme.colors.grey_3};
	text-decoration: none;
	cursor: pointer;

	&:hover {
		background-color: ${theme.colors.grey_1};
	}
`;
