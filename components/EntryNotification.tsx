/*
 *
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import IconButton from './IconButton';

import { OvertureUser as Logo } from './theme/icons/';
import DismissIcon from './theme/icons/dismiss';

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

const DismissButtonContainer = styled.div`
	display: flex;
	align-items: center;
`;

const EntryNotification = ({
	children,
	className,
	title,
	size,
	onDismiss,
	dismissible = true,
	...props
}: {
	children: React.ReactNode;
	className?: string;
	title?: string;
	size: EntrySize;
	styles?: string;
	onDismiss?: Function;
	dismissible?: boolean;
}) => {
	const theme = useTheme();

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
								<Logo
									{...getIconDimensions(size)}
									style={css`
										${getIconStyle(size)};
									`}
								/>{' '}
								{title}
							</span>
							{dismissible && (
								<DismissButtonContainer>
									<IconButton
										onClick={(e: React.MouseEvent) => (onDismiss ? onDismiss() : () => null)}
										Icon={DismissIcon}
										height={12}
										width={12}
										fill={theme.colors.accent2}
									/>
								</DismissButtonContainer>
							)}
						</EntryTitle>
						{children}
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
						{dismissible && (
							<IconButton
								onClick={(e: React.MouseEvent) => (onDismiss ? onDismiss() : () => null)}
								Icon={DismissIcon}
								height={12}
								width={12}
								fill={theme.colors.accent2}
							/>
						)}
					</div>
				)}
			</EntryContentContainer>
		</div>
	);
};

export default EntryNotification;
