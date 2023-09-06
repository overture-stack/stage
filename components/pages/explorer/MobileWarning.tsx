import IconButton from '@/components/IconButton';
import { css, useTheme } from '@emotion/react';
import { useState } from 'react';
import { Dismiss as DismissIcon, Error as ErrorIcon } from '../../theme/icons';

const MobileWarning = () => {
	const theme = useTheme();
	const [showMobileWarning, setShowMobileWarning] = useState<boolean>(true);
	const hideMobileWarning = () => setShowMobileWarning(false);
	return showMobileWarning ? (
		<div
			css={css`
				background: ${theme.colors.warning_light};
				border-left: 5px solid ${theme.colors.warning_medium};
				padding: 10px 16px;
				display: flex;
				justify-content: space-between;
				align-items: start;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				z-index: 100;
				display: none;
				@media screen and (max-width: 1024px) {
					display: block;
				}
			`}
		>
			<div
				css={css`
					flex-shrink: 0;
				`}
			>
				<ErrorIcon width={18} fill={theme.colors.warning_dark} />
			</div>
			<div
				css={css`
					flex-grow: 1;
					padding: 0 8px;
				`}
			>
				<div
					css={css`
						font-weight: bold;
						margin-bottom: 4px;
					`}
				>
					This website may not be supported for your device.
				</div>
				<div>
					Please visit this website using a device with a wider screen for optimal experience and
					access to all features.
				</div>
			</div>
			<div
				css={css`
					margin: 0 8px 0 16px;
				`}
			>
				<IconButton
					onClick={hideMobileWarning}
					Icon={DismissIcon}
					height={12}
					width={12}
					fill={theme.colors.black}
				/>
			</div>
		</div>
	) : (
		<></>
	);
};

export default MobileWarning;
