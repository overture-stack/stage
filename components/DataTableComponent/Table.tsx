/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

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
			console.log('examples', examples);
			const long = examples.join(', ');
			return long?.length > 80 ? (
				<div>
					{long.slice(0, 80)}...
					<a href="#" css={readMoreStyle}>
						{' '}
						Read more
					</a>
				</div>
			) : (
				long
			);
		},
	}),
];

// Emotion styles
const sectionStyle = css`
	margin-bottom: 48px;
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

const thStyle = css`
	background: #f3f6f9;
	text-align: left;
	padding: 12px;
	border-bottom: 1px solid #dcdcdc;
`;

const tdStyle = css`
	padding: 12px;
	border-bottom: 1px solid #eaeaea;
	vertical-align: top;
`;

const fieldNameStyle = css`
	font-weight: 600;
`;

const fieldDescStyle = css`
	font-size: 12px;
	color: #666;
`;

const readMoreStyle = css`
	color: #1976d2;
	font-size: 12px;
	text-decoration: none;
	margin-left: 4px;
	&:hover {
		text-decoration: underline;
	}
`;

export default function SchemaTables({ schemaMap }: Props) {
	return (
		<div>
			{Array.from(schemaMap.values()).map((schema, i) => {
				const table = useReactTable({
					data: schema.fields ?? [],
					columns: getColumns(),
					getCoreRowModel: getCoreRowModel(),
				});

				return (
					<div key={i} css={sectionStyle}>
						<div css={schemaTitleStyle}>{schema.name}</div>
						<div css={schemaDescStyle}>{schema.description}</div>

						<table css={tableStyle}>
							<thead>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th key={header.id} css={thStyle}>
												{flexRender(header.column.columnDef.header, header.getContext())}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row) => (
									<tr key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<td key={cell.id} css={tdStyle}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);
			})}
		</div>
	);
}
