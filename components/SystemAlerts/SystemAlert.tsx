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

import { css } from '@emotion/react';

import { default as theme } from '@/components/theme';
import { Error as ErrorIcon, Info, Warning } from '@/components/theme/icons';
import Dismiss from '@/components/theme/icons/dismiss';

export type AlertLevel = 'info' | 'warning' | 'critical';

export type AlertDef = {
	level: AlertLevel;
	title: string;
	message?: string;
	dismissible: boolean;
	id: string;
};

type Props = {
	alert: AlertDef;
	onClose: () => void;
};

const alertContainerStyle = (backgroundColor: string, outline: string) => css`
	padding: 12px;
	display: flex;
	justify-content: space-between;
	background-color: ${backgroundColor};
	border-bottom: 1px solid ${outline};
`;

const contentWrapperStyle = css`
	display: flex;
`;

const iconContainerStyle = css`
	margin: auto 15px auto auto;
`;

const titleStyle = (textColor: string, hasMessage: boolean) => css`
	color: ${textColor};
	margin-top: ${hasMessage ? '0px' : '6px'};
	${theme.typography.heading};
`;

const messageStyle = (textColor: string) => css`
	color: ${textColor};
	margin-bottom: 8px;
	${theme.typography.regular};
`;

const dismissButtonStyle = css`
	cursor: pointer;
`;

const AlertVariants = {
	critical: {
		backgroundColor: theme.colors.error_2,
		icon: <ErrorIcon height={26} width={26} />,
		textColor: theme.colors.black,
		outline: theme.colors.error_dark,
	},
	warning: {
		backgroundColor: theme.colors.warning_light,
		icon: <Warning height={26} width={26} />,
		textColor: theme.colors.black,
		outline: theme.colors.warning_dark,
	},
	info: {
		backgroundColor: theme.colors.secondary_1,
		icon: <Info fill={theme.colors.secondary_accessible} />,
		textColor: theme.colors.black,
		outline: theme.colors.secondary_dark,
	},
};

export const SystemAlert = ({ alert, onClose }: Props) => {
	const { backgroundColor, icon, textColor, outline } = AlertVariants[alert.level];

	return (
		<div css={alertContainerStyle(backgroundColor, outline)}>
			<div css={contentWrapperStyle}>
				<div css={iconContainerStyle}>{icon}</div>
				<div>
					<div css={titleStyle(textColor, !!alert.message)}>{alert.title}</div>
					{alert.message && <div css={messageStyle(textColor)} dangerouslySetInnerHTML={{ __html: alert.message }} />}
				</div>
			</div>
			{alert.dismissible && (
				<div css={dismissButtonStyle} onClick={onClose}>
					<Dismiss height={15} width={15} fill={theme.colors.black} />
				</div>
			)}
		</div>
	);
};
