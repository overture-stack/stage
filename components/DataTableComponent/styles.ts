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

export const sectionStyle = css`
	margin-bottom: 48px;
	max-width: 1200px;
`;

export const schemaTitle = css`
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 10px;
`;

export const schemaDescription = css`
	font-size: 14px;
	color: #555;
	margin-bottom: 20px;
`;

export const thStyle = css`
	background: #e5edf3;
	text-align: left;
	padding: 12px;
	border-bottom: 1px solid #dcdcdc;
`;
export const tableStyle = css`
	width: 100%;
	border-collapse: collapse;
	margin-top: 8px;
`;
export const tdStyle = css`
	padding: 12px;
	border-bottom: 1px solid #eaeaea;
	max-width: 30vw;
	white-space: pre-wrap;
	overflow-wrap: break-word;
	word-break: break-word;
	vertical-align: top;
`;

export const rowStyle = (index: number) => css`
	background-color: ${index % 2 === 0 ? '' : '#F5F7F8'};
`;

export const linkStyle = css`
	color: #0b75a2;
	font-size: 12px;
	cursor: pointer;
	margin-left: 6px;

	&:hover {
		text-decoration: underline;
	}
`;

export const fieldNameStyle = css`
	font-weight: 600;
`;

export const fieldDescStyle = css`
	font-size: 12px;
	color: #666;
`;
