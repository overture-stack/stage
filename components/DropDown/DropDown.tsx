import { useTheme } from '@emotion/react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { TransparentButton } from '../Button';
import { ChevronDown } from '../theme/icons';
import DropDownContent from './DropDownContent';
import DropDownItem from './DropDownItem';
import { ChevronStyle, DropDownTitleStyle, DropdownMenuStyle, ParentStyle } from './styles';
import { DropDownProps } from './types';

const Dropdown: FC<DropDownProps> = ({ MenuItemMap = new Map(), title, disabled, children }) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const theme = useTheme();

	const hasMenuItems = MenuItemMap.size > 0;
	const IterableMenuMap = hasMenuItems ? Array.from(MenuItemMap.entries()) : [];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && open) {
				setOpen(false);
			}
		};
		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open]);

	const handleToggle = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setOpen((prev) => !prev);
	}, []);

	const renderMenuItems = () => {
		if (!hasMenuItems) {
			return null;
		}
		return IterableMenuMap.map(([label, link]) => (
			<DropDownItem key={label} label={label}>
				<DropDownContent>
					<DropDownItem link={link} label={label} />
				</DropDownContent>
			</DropDownItem>
		));
	};

	return (
		<div ref={dropdownRef} css={ParentStyle}>
			<div>
				<TransparentButton onClick={handleToggle} disabled={disabled}>
					<span css={DropDownTitleStyle(theme)}>{title}</span>
					<ChevronDown fill={theme.colors.accent_dark} width={12} height={12} style={ChevronStyle(open)} />
				</TransparentButton>

				{open && !disabled && <ul css={DropdownMenuStyle(theme)}>{hasMenuItems ? renderMenuItems() : children}</ul>}
			</div>
		</div>
	);
};

export default Dropdown;
