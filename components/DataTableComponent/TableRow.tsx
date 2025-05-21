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

import { flexRender } from '@tanstack/react-table';
import { useState } from 'react';
import { linkStyle, rowStyle, tdStyle } from './styles';
import { TableRowProps } from './types';

const TableRow = <T,>({ row, index }: TableRowProps<T>) => {
	const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>({});

	const toggleExpand = (cellId: string) => {
		setExpandedCells((prev) => ({
			...prev,
			[cellId]: !prev[cellId],
		}));
	};

	return (
		<tr key={row.id} css={rowStyle(index)}>
			{row.getVisibleCells().map((cell) => {
				const cellValue = cell.getValue();

				if (cellValue === undefined || cellValue === null || cellValue === '') {
					return <td key={cell.id} css={tdStyle}></td>;
				}

				const valueStr = cellValue.toString();
				const isLong = valueStr.length > 68;
				const isExpanded = expandedCells[cell.id];

				if (isLong) {
					return (
						<td key={cell.id} css={tdStyle}>
							<span>{isExpanded ? valueStr : valueStr.slice(0, 68) + ' ...'}</span>
							<span css={linkStyle} onClick={() => toggleExpand(cell.id)}>
								{!isExpanded ? '\nRead more' : '\nRead less'}
							</span>
						</td>
					);
				}

				return (
					<td key={cell.id} css={tdStyle}>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</td>
				);
			})}
		</tr>
	);
};

export default TableRow;
