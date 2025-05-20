import { createColumnHelper } from '@tanstack/react-table';
import { fieldNameStyle, fieldDescStyle } from './styles';
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

export const columnHelper = createColumnHelper<Field>();

export const getColumns = () => [
	columnHelper.accessor('name', {
		header: 'Field',
		cell: (field) => (
			<>
				<div css={fieldNameStyle}>{field.row.original.meta?.displayName}</div>
				<div css={fieldDescStyle}>{field.row.original.description}</div>
			</>
		),
	}),
	columnHelper.accessor((row) => row.restrictions?.required ?? false, {
		id: 'required',
		header: 'Required',
		cell: (required) => (required.getValue() ? 'Yes' : 'No'),
	}),
	columnHelper.accessor('valueType', {
		header: 'Type',
		cell: (type) => {
			const { valueType, isArray, delimiter } = type.row.original;
			return (
				<div>
					{valueType}
					{isArray}
					{delimiter}
				</div>
			);
		},
	}),
	columnHelper.accessor((row) => row.meta?.examples ?? [], {
		id: 'examples',
		header: 'Examples',
		cell: (examples) => {
			return examples.getValue().join(',  ');
		},
	}),
];
