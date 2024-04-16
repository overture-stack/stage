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

import styled from '@emotion/styled';
import { css } from '@emotion/react';

import defaultTheme from './theme';

const HeroLink = styled('a')`
	${({ theme }: { theme: typeof defaultTheme }) => css`
		color: ${theme.colors.secondary_accessible};
		${theme.typography.regular};
		line-height: 24px;
		cursor: pointer;
		user-select: none;
		&:hover {
			color: ${theme.colors.accent2};
		}
	`}
`;

export const HeroLinkAsButton = styled(HeroLink)`
	${({ theme }: { theme: typeof defaultTheme }) => css`
		color: ${theme.colors.white};
		background-color: ${theme.colors.accent};
		${theme.typography.subheading2};
		line-height: 24px;
		border-radius: 5px;
		border: 1px solid ${theme.colors.accent};
		padding: 6px 15px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		position: relative;
		text-decoration: none;
		&:hover {
			color: ${theme.colors.accent2};
			background-color: ${theme.colors.accent2};
		}
	`}
`;

export default HeroLink;