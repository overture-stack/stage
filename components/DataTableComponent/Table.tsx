import { css } from '@emotion/react';
import { createColumnHelper, flexRender, getCoreRowModel, HeaderGroup, useReactTable } from '@tanstack/react-table';
import { FC } from 'react';
import TableRow from './TableRow';
import TableHeader from './TableHeader';

type Field = {
	name: string;
	description: string;
	valueType: string;
	unique?: boolean;
	isArray?: boolean;
	delimiter?: string;
	restrictions?: {
		required?: boolean;
		regex?: string;
		codeList?: string[];
	};
	meta?: {
		displayName?: string;
		examples?: string[];
	};
};
type Schema = {
	name: string;
	description: string;
	fields: Field[];
};
type Props = {
	schemaMap: Map<number, any>;
};
const columnHelper = createColumnHelper<Field>();
const getColumns = () => [
	columnHelper.accessor('name', {
		header: 'Field',
		cell: (info) => (
			<div>
				<div css={fieldNameStyle}>{info.row.original.meta?.displayName || info.getValue()}</div>
				<div css={fieldDescStyle}>{info.row.original.description}</div>
			</div>
		),
	}),
	columnHelper.accessor((row) => row.restrictions?.required ?? false, {
		id: 'required',
		header: 'Required',
		cell: (info) => (info.getValue() ? 'Yes' : 'No'),
	}),
	columnHelper.accessor('valueType', {
		header: 'Type',
		cell: (info) => {
			const { valueType, isArray, delimiter } = info.row.original;
			return (
				<div>
					{valueType}
					{isArray && ', Array'}
					{delimiter && ` (Delimiter: ${delimiter})`}
				</div>
			);
		},
	}),
	columnHelper.accessor((row) => row.meta?.examples ?? [], {
		id: 'examples',
		header: 'Examples',
		cell: (info) => {
			const examples = info.getValue();
			const long = examples.join(', ');
			return long;
		},
	}),
];

const sectionStyle = css`
	margin-bottom: 48px;
	max-width: 1200px;
`;

const schemaTitleStyle = css`
	font-size: 20px;
	font-weight: bold ?? [];
	margin-bottom: 4px;
`;

const schemaDescStyle = css`
	font-size: 14px;
	color: #555;
	margin-bottom: 16px;
`;

const tableStyle = css`
	width: 100%;
	border-collapse: collapse;
	margin-top: 8px;
`;

const fieldNameStyle = css`
	font-weight: 600;
`;

const fieldDescStyle = css`
	font-size: 12px;
	color: #666;
`;

const SchemaTables: FC<Props> = ({ schemaMap }) => {
	var schemaMapArray = Array.from(schemaMap.values());
	return (
		<div>
			{schemaMapArray.map((schema: Schema, i: number) => {
				const table = useReactTable({
					data: schema.fields,
					columns: getColumns(),
					getCoreRowModel: getCoreRowModel(),
				});

				return (
					<div key={i} css={sectionStyle}>
						<div css={schemaTitleStyle}>{schema.name}</div>
						<div css={schemaDescStyle}>{schema.description}</div>
						<table css={tableStyle}>
							<thead>
								{table.getHeaderGroups().map((headerGroup: HeaderGroup<Field>) => (
									<TableHeader headerGroup={headerGroup} />
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
