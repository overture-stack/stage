import { useState, useRef, useEffect, ComponentType } from 'react';
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { ChevronDown } from './theme/icons';
import { NavbarDropDownProps } from '@/global/types';
import { TransparentButton } from './Button';

const StyledListItem = styled('a')`
	${({ theme }) => css`
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
	`}
`;

const NavbarDropDown: ComponentType<NavbarDropDownProps> = ({ MenuItemMap = new Map(), title, disabled }) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const theme = useTheme();
	const IterableMenuMap = Array.from(MenuItemMap.entries());

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setOpen(false);
		}
	};

	useEffect(() => {
		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open]);

	return (
		<Transpar
			ref={dropdownRef}
			css={css`
				position: relative;
				display: flex;
				align-items: center;
				cursor: pointer;
			`}
			onClick={() => setOpen(!open)}
		>
			<span
				css={css`
					padding: 5px 10px;
					font-weight: bold;
				`}
			>
				{title}
			</span>
			<ChevronDown
				fill={theme.colors.accent_dark}
				width={12}
				height={12}
				style={css`
					transform: open ? 'rotate(180deg)' : 'none',
					transition: 'transform 0.2s ease',
					`}
			/>

			{!disabled && open && (
				<ul
					css={css`
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

						li {
							width: 100%;
							box-sizing: border-box;
							&:hover,
							&:focus {
								background-color: ${theme.colors.grey_3};
							}
						}
					`}
				>
					{IterableMenuMap.map(([title, link]) => (
						<li key={title}>
							<StyledListItem href={link}>{title}</StyledListItem>
						</li>
					))}
				</ul>
			)}
		</TransparentButton>
	);
};

export default NavbarDropDown;
