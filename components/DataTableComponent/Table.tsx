import { ColumnDef, getCoreRowModel, HeaderGroup, useReactTable } from '@tanstack/react-table';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { schemaDescription, schemaTitle, sectionStyle, tableStyle } from './styles';

type Schema<T> = {
	name: string;
	description: string;
	fields: T[];
};

type Props<T> = {
	schemaMap: Map<number, Schema<T>>;
	getColumns: () => ColumnDef<T, any>[];
};

const SchemaTables = <T,>({ schemaMap, getColumns }: Props<T>) => {
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
