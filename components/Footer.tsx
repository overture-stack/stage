/*
 *
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
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

import { ACKNOWLEDGEMENTS, DISCLAIMER_PATH, EMAIL, GITHUB, LICENSING } from '@/global/utils/constants';
import { getConfig } from '@/global/config';

import StyledLink from './Link';
import defaultTheme from './theme';
import { OvertureLogoWithText } from './theme/icons';

const Footer = () => {
	const { NEXT_PUBLIC_UI_VERSION } = getConfig();

	return (
		<div
			css={(theme: typeof defaultTheme) => css`
				height: ${theme.dimensions.footer.height}px;
				background-color: ${theme.colors.white};
				border-top: 1px solid ${theme.colors.grey_3};
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: 0 18px;
				${theme.shadow.default};
				z-index: 10;
				position: fixed;
				bottom: 0px;
				left: 0px;
				right: 0px;
				@media only screen and (max-width: 843px) {
					display: none;
				}
			`}
		>
			{' '}
			<StyledLink
				css={(theme) => css`
					${theme.typography.subheading2};
					padding-left: 10px;
					padding-right: 10px;
				`}
				href={DISCLAIMER_PATH}
			>
				Disclaimers
			</StyledLink>
			|
			<StyledLink
				css={(theme) => css`
					${theme.typography.subheading2};
					padding-left: 10px;
					padding-right: 10px;
				`}
				href={ACKNOWLEDGEMENTS}
				rel="noopener noreferrer"
				target="_blank"
			>
				Acknowledgements
			</StyledLink>
			|
			<StyledLink
				css={(theme) => css`
					${theme.typography.subheading2};
					padding-left: 10px;
					padding-right: 10px;
				`}
				href={GITHUB}
				rel="noopener noreferrer"
				target="_blank"
			>
				GitHub
			</StyledLink>
			|
			<StyledLink
				css={(theme) => css`
					${theme.typography.subheading2};
					padding-left: 10px;
					padding-right: 10px;
				`}
				href={LICENSING}
				rel="noopener noreferrer"
				target="_blank"
			>
				Software Licensing
			</StyledLink>
			|
			<StyledLink
				css={(theme) => css`
					${theme.typography.subheading2};
					padding-left: 10px;
					padding-right: 10px;
				`}
				href={EMAIL}
				rel="noopener noreferrer"
				target="_blank"
			>
				contact@overture.bio
			</StyledLink>
			|
			<span
				css={(theme) =>
					css`
						color: ${theme.colors.accent_dark};
						${theme.typography.subheading2}
						line-height: 24px;
						font-weight: normal;
						padding-left: 10px;
						padding-right: 10px;
					`
				}
			>
				{NEXT_PUBLIC_UI_VERSION && `  UI v${NEXT_PUBLIC_UI_VERSION}`} powered by
			</span>
			<a href="https://www.overture.bio/" rel="noopener noreferrer" target="_blank">
				<OvertureLogoWithText width={100} height={18} />
			</a>
		</div>
	);
};

export default Footer;
