import { css } from '@emotion/react';
import React from 'react';
import defaultTheme from '../theme';
import { Error as ErrorIcon, Info } from '../theme/icons';
import { Warning } from '../theme/icons';
import Dismiss from '../theme/icons/dismiss';
import { AlertDef } from './types';
import theme from '../theme';
type Props = {
	alert: AlertDef;
	onClose: () => void;
};
const warningColor = theme.colors.warning_light;
const AlertVariants = {
	critical: {
		backgroundColor: defaultTheme.colors.error_2,
		icon: <ErrorIcon height={26} width={26} />,
		textColor: defaultTheme.colors.black,
	},
	warning: {
		backgroundColor: warningColor,
		icon: <Warning height={26} width={26} />,
		textColor: defaultTheme.colors.black,
	},
	info: {
		backgroundColor: defaultTheme.colors.secondary_1,
		icon: <Info />,
		textColor: defaultTheme.colors.black,
	},
};

export const SystemAlert: React.FC<Props> = ({ alert, onClose }) => {
	const { backgroundColor, icon, textColor } = AlertVariants[alert.level];

	const createMarkup = (msg: string) => ({ __html: msg });

	return (
		<div
			css={css`
				padding: 12px;
				display: flex;
				justify-content: space-between;
				background-color: ${backgroundColor};
			`}
		>
			<div
				css={css`
					display: flex;
				`}
			>
				<div
					css={css`
						margin: auto 15px auto auto;
					`}
				>
					{icon}
				</div>
				<div>
					<div
						css={css`
							color: ${textColor};
							margin-top: ${alert.message ? '0px' : '6px'};
							${defaultTheme.typography.heading};
						`}
					>
						{alert.title}
					</div>
					{alert.message && (
						<div
							css={css`
								color: ${textColor};
								margin-bottom: 8px;
								${defaultTheme.typography.regular};
							`}
							dangerouslySetInnerHTML={createMarkup(alert.message)}
						/>
					)}
				</div>
			</div>
			{alert.dismissable && (
				<div
					css={css`
						cursor: pointer;
					`}
					onClick={onClose}
				>
					<Dismiss height={15} width={15} fill={defaultTheme.colors.black} />
				</div>
			)}
		</div>
	);
};
