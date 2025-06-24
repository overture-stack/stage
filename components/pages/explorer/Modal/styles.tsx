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

import { css, Theme } from '@emotion/react';

export const accentBadgeStyle = ({ theme, isDisabled }: { theme: Theme; isDisabled: boolean }) => css`
	${badgeStyle({ theme, isDisabled })}
	background-color: ${theme.colors.accent_light};
	margin-left: 5px;
	${isDisabled ? `background-color: ${theme.colors.grey_5};` : ''}
`;

export const badgeStyle = ({ theme, isDisabled }: { theme: Theme; isDisabled: boolean }) => css`
	display: inline-flex;
	border: none;
	border-radius: 20px;
	margin: 5px;
	margin-left: 0px;
	min-width: fit-content;
	padding: 3px 10px;
	background-color: ${theme.colors.accent};
	color: ${theme.colors.white};

	${isDisabled ? `background-color: ${theme.colors.grey_6};` : ''}
`;

export const optionStyle = ({ theme, isEnabled }: { theme: Theme; isEnabled: boolean }) => css`
	background: unset;
	border: 1px solid ${theme.colors.grey_5};
	border-radius: 16px;
	cursor: pointer;
	display: inline-flex;
	flex: 1;
	font-family: 'Lato', sans-serif;
	margin: 0 0.5rem;
	padding: 10px;
	position: relative;

	${isEnabled ? '' : `cursor: not-allowed;`}
`;
