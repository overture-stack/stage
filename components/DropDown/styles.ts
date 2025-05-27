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

export const ParentStyle = css`
	position: relative;
	display: inline-block;
`;

export const DropDownTitleStyle = (theme: any) => css`
	padding: 10px 16px;
	font-weight: 400;
	font-size: 16px;
	line-height: 1.2;
	color: ${theme.colors.accent_dark};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const ChevronStyle = (open: boolean) => css`
	transform: ${open ? 'rotate(180deg)' : ''};
	transition: transform 0.2s ease;
`;

export const DropdownMenuStyle = (theme: any) => css`
	position: absolute;
	top: calc(100% + 5px);
	left: 0;
	width: 100%;
	max-height: 300px;
	overflow-y: auto;

	background-color: #fff;
	border: 1px solid ${theme.colors.grey_1};
	border-radius: 4px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	list-style: none;
	padding: 0;
	margin: 0;
	z-index: 1000;
`;

export const StyledListItemStyle = (theme: any, customStyles?: any) => css`
	display: flex;
	align-items: center;
	width: 100%;
	padding: 10px 16px;
	color: ${theme.colors.black};
	background-color: #fff;
	cursor: pointer;
	font-size: 14px;
	border: none;

	&:hover {
		background-color: ${theme.colors.grey_2};
	}

	${customStyles?.base}
`;
