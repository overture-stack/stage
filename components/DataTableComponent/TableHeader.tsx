import { flexRender, HeaderGroup } from '@tanstack/react-table';
import { thStyle } from './styles';
import { TableHeaderProps } from './types';

const TableHeader = <T,>({ headerGroup }: TableHeaderProps<T>) => {
	return (
		<tr key={headerGroup.id}>
			{headerGroup.headers.map((header) => (
				<th key={header.id} colSpan={header.colSpan} css={thStyle}>
					{flexRender(header.column.columnDef.header, header.getContext())}
				</th>
			))}
		</tr>
	);
};

export default TableHeader;
