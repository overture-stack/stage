/*
 *
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *   If not, see <http://www.gnu.org/licenses/>.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 *  SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 *  OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 *  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import { useTheme } from '@emotion/react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { DropdownButton } from '../Button';
import { ChevronDown } from '../theme/icons';
import DropDownItem from './DropDownItem';
import { ChevronStyle, DropDownTitleStyle, DropdownMenuStyle, ParentStyle } from './styles';
import { DropDownProps } from './types';
import DropDownContent from './DropDownContent';

const Dropdown: FC<DropDownProps> = ({ MenuItemMap = new Map(), title, children, leftIcon }) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const theme = useTheme();

	const hasMenuItems = MenuItemMap.size > 0;
	const IterableMenuMap = hasMenuItems ? Array.from(MenuItemMap.entries()) : [];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
		return IterableMenuMap.map(([label, action]) => (
			<DropDownItem key={label} action={action}>
				<DropDownContent>{label}</DropDownContent>
			</DropDownItem>
		));
	};

	return (
		<div ref={dropdownRef} css={ParentStyle}>
			<div>
				<DropdownButton onClick={handleToggle}>
					{leftIcon}
					<span css={DropDownTitleStyle(theme)}>{title}</span>
					<ChevronDown fill={theme.colors.black} width={18} height={18} style={ChevronStyle(open)} />
				</DropdownButton>

				{open && <ul css={DropdownMenuStyle(theme)}>{hasMenuItems ? renderMenuItems() : children}</ul>}
			</div>
		</div>
	);
};

export default Dropdown;
