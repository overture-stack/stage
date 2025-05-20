import { ColumnDef, HeaderGroup, Row } from '@tanstack/react-table';

export type tableHeaderProps = {
	title: string;
};

export type Schema<T> = {
	name: string;
	description: string;
	fields: T[];
};

export type SchemaTableProps<T> = {
	schemaMap: Map<number, Schema<T>>;
	getColumns: () => ColumnDef<T, any>[];
};

export type TableHeaderProps<T> = {
	headerGroup: HeaderGroup<T>;
};

export type TableRowProps<T> = {
	row: Row<T>;
	index: number;
};
