import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
type Person = { name: string; age: number; status: string };
const data: Person[] = [
	{ name: 'Alice', age: 25, status: 'Active' },
	{ name: 'Bob', age: 30, status: 'Inactive' },
	{ name: 'Charlie', age: 35, status: 'Pending' },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
	columnHelper.accessor('name', {
		header: 'Name',
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor('age', {
		header: 'Age',
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor('status', {
		header: 'Status',
		cell: (info) => info.getValue(),
	}),
];

export default function Table() {
	const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
	return (
		<div>
			{' '}
			<table>
				{' '}
				<thead>
					{' '}
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{' '}
							{headerGroup.headers.map((header) => (
								<th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
