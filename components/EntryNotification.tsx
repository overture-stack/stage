import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';

import { OvertureUser as Logo } from './theme/icons/';
import Button from './Button';
import Loader from './Loader';

type EntrySize = 'lg' | 'md' | 'sm';

const ENTRY_SIZES = {
	LG: 'lg' as EntrySize,
	MD: 'md' as EntrySize,
	SM: 'sm' as EntrySize,
};

const getIconDimensions = (size: EntrySize) =>
	({
		[ENTRY_SIZES.LG]: { width: 50, height: 52 },
		[ENTRY_SIZES.MD]: { width: 25, height: 26 },
		[ENTRY_SIZES.SM]: { width: 22, height: 22 },
	}[size]);

const getContainerStyles = (size: EntrySize) =>
	({
		[ENTRY_SIZES.LG]: `
      padding: 1rem 2rem;
      line-height: 26px;
    `,
		[ENTRY_SIZES.MD]: `
      padding: 1rem;
      line-height: 24px;
    `,
		[ENTRY_SIZES.SM]: `
      padding: 0.5rem;
      line-height: 20px;
      display: flex;
      align-items: center;
    `,
	}[size]);

const EntryContentContainer = styled('div')<{ size: EntrySize }>`
	${({ theme, size }) => css`
		border: 1px solid ${theme.colors.grey_1};
		border-radius: 5px;
		${theme.shadow.default};
		${theme.typography.subheading};
		font-weight: normal;
		background-color: ${theme.colors.white};
		color: ${theme.colors.black};
		${getContainerStyles(size)};
		max-width: 600px;
		position: relative;
	`}
`;

const getIconStyle = (size: EntrySize) =>
	({
		[ENTRY_SIZES.LG]: 'padding: 5px 5px 0px',
		[ENTRY_SIZES.MD]: 'padding-right: 15px',
		[ENTRY_SIZES.SM]: '',
	}[size]);

const getTitleStyle = (size: EntrySize) =>
	({
		[ENTRY_SIZES.LG]: `
      margin: 0.5rem 0 1rem;
      font-size: 24px;
      line-height: 38px;
    `,
		[ENTRY_SIZES.MD]: `
      margin: 0rem;
      padding-bottom: 0.4rem;
      font-size: 18px;
      line-height: 20px;
    `,
		[ENTRY_SIZES.SM]: `
      margin: 0rem,
      line-height: 16px;
    `,
	}[size]);

const EntryTitle = styled('h1')<{ size: EntrySize }>`
	${({ size }) => css`
		display: flex;
		align-items: center;
		justify-content: space-between;
		${getTitleStyle(size)}
	`}
`;

function randomIntFromInterval(min: number, max: number) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const EntryNotification = ({
	children,
	className,
	dismissible = true,
	loading: parentLoading,
	onDismiss,
	size,
	title,
	...props
}: {
	children: React.ReactNode;
	className?: string;
	dismissible?: boolean;
	loading?: boolean;
	onDismiss?: Function;
	size: EntrySize;
	styles?: string;
	title?: string;
}) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (parentLoading === undefined) {
			const delay = randomIntFromInterval(750, 2000);
			const timer = setTimeout(() => setLoading(false), delay);

			return () => clearTimeout(timer);
		} else {
			setLoading(parentLoading);
		}
	}, [parentLoading]);

	return (
		<div
			className={className}
			css={css`
				display: flex;
				flex: 1;
			`}
		>
			<EntryContentContainer size={size}>
				{title ? (
					<div>
						<EntryTitle size={size}>
							<span>
								<div
									css={css`
										display: flex;
										flex-direction: row;
									`}
								>
									<div>
										<Logo
											{...getIconDimensions(size)}
											style={css`
												${getIconStyle(size)};
											`}
										/>{' '}
									</div>
									<div
										css={css`
											padding-left: 20px;
											padding-top: 10px;
										`}
									>
										{title}
									</div>
								</div>
							</span>
						</EntryTitle>
						{children}
						<div
							css={css`
								padding: 15px;
								text-align: center;
								max-width: fit-content;
								margin-left: auto;
								margin-right: auto;
							`}
						>
							{loading ? (
								<Loader />
							) : (
								<Button
									onClick={() => {
										if (onDismiss) {
											onDismiss();
										}
									}}
								>
									Get Started
								</Button>
							)}
						</div>
						<p
							css={css`
								font-size: 12px;
								margin-bottom: 0px;
							`}
						>
							<b>Disclaimer:</b> All data is intended for demo purposes only and does not represent
							any real or operational information.
						</p>
					</div>
				) : (
					<div
						css={css`
							display: flex;
							flex-direction: row;
						`}
					>
						<span>
							<Logo
								{...getIconDimensions(size)}
								style={css`
									${getIconStyle(size)};
								`}
							/>
						</span>
						<div
							css={css`
								margin-left: 10px;
								margin-right: 10px;

								display: flex;
								align-items: center;
								justify-content: center;
							`}
						>
							{children}
						</div>
					</div>
				)}
			</EntryContentContainer>
		</div>
	);
};

export default EntryNotification;
