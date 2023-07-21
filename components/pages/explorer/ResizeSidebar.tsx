import { Chevron } from '@/components/theme/icons';
import { css, useTheme } from '@emotion/react';
import { ReactNode } from 'react';
import { Rnd } from 'react-rnd';

export const sidebarHeight = '100%';
export const sidebarToggleWidth = 28;
export const sidebarMinWidth = 150;

export const SidebarResizeWrapper = ({
	children,
	setSidebarWidth,
	sidebarDefaultWidth,
	sidebarVisible,
	sidebarWidth,
}: {
	children: ReactNode;
	setSidebarWidth: (width: number) => void;
	sidebarDefaultWidth: number;
	sidebarVisible: boolean;
	sidebarWidth: number;
}) => {
	const theme = useTheme();
	return (
		<Rnd
			bounds="parent"
			default={{
				x: 0,
				y: 0,
				width: sidebarDefaultWidth,
				height: sidebarHeight,
			}}
			disableDragging
			enableResizing={{
				bottom: false,
				bottomLeft: false,
				bottomRight: false,
				left: false,
				right: true,
				top: false,
				topLeft: false,
				topRight: false,
			}}
			maxWidth="50%"
			maxHeight={sidebarHeight}
			onResize={(e, direction, ref) => {
				setSidebarWidth(ref.offsetWidth);
			}}
			size={{
				width: sidebarWidth,
				height: sidebarHeight,
			}}
			style={{
				top: `-${theme.dimensions.navbar.height}px`,
				bottom: theme.dimensions.footer.height,
				boxShadow: theme.shadow.right.replace('box-shadow: ', '').replace(';', ''),
				wordWrap: 'break-word',
				display: sidebarVisible ? 'block' : 'none',
			}}
		>
			{children}
		</Rnd>
	);
};

export const SidebarToggle = ({
	sidebarVisible,
	toggleSidebarVisible,
}: {
	sidebarVisible: boolean;
	toggleSidebarVisible: () => void;
}) => {
	const theme = useTheme();
	return (
		<div
			css={css`
				position: absolute;
				height: calc(100% - 20px);
				top: 10px;
				bottom: 10px;
				border: 0 none;
				background: none;
				display: ${sidebarVisible ? 'none' : 'block'};
			`}
		>
			<button
				css={css`
					height: 100%;
					display: block;
					border-radius: 0 100px 100px 0;
					background: ${theme.colors.white};
					border: 2px solid ${theme.colors.grey_2};
					border-left-width: 0;
					padding: 0 5px;
					cursor: pointer;
					&:hover {
						background: ${theme.colors.grey_1};
					}
				`}
				onClick={() => {
					toggleSidebarVisible();
				}}
			>
				<Chevron
					fill={theme.colors.accent}
					style={css`
						transform: rotate(-90deg);
						margin-left: 2px;
					`}
					width={16}
					height={16}
				/>
			</button>
		</div>
	);
};
