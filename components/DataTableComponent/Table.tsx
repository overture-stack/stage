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

import { getCoreRowModel, HeaderGroup, useReactTable } from '@tanstack/react-table';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { schemaDescription, schemaTitle, sectionStyle, tableStyle } from './styles';
import { SchemaTableProps } from './types';

const SchemaTables = <T,>({ schemaMap, getColumns }: SchemaTableProps<T>) => {
	const schemaArray = Array.from(schemaMap.values());

	return (
		<div>
			{schemaArray.map((schema, i) => {
				const table = useReactTable({
					data: schema.fields,
					columns: getColumns(),
					getCoreRowModel: getCoreRowModel(),
				});

				return (
					<div key={i} css={sectionStyle}>
						<div css={schemaTitle}>{schema.name}</div>
						<div css={schemaDescription}>{schema.description}</div>
						<table css={tableStyle}>
							<thead>
								{table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
									<TableHeader key={headerGroup.id} headerGroup={headerGroup} />
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row, i: number) => (
									<TableRow key={row.id} row={row} index={i} />
								))}
							</tbody>
						</table>
					</div>
				);
			})}
		</div>
	);
};

export default SchemaTables;
