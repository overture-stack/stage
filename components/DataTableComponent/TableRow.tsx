import { css } from '@emotion/react';
import { Row, flexRender } from '@tanstack/react-table';

type Props<T> = {
	row: Row<T>;
	index: number;
};

const TableRow = <T,>({ row, index }: Props<T>) => {
	const rowStyle = css`
		background-color: ${index % 2 === 0
			? ''
			: '#F5F7F8'}; // dynamic background color based off of index, must be even or odd, replace with theme color once merged in with other branch
	`;

	const tdStyle = css`
		padding: 12px;
		border-bottom: 1px solid #eaeaea;
		vertical-align: top;
	`;

	return (
		<tr key={row.id} css={rowStyle}>
			{row.getVisibleCells().map((cell) => (
				<td key={cell.id} css={tdStyle}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</td>
			))}
		</tr>
	);
};

export default TableRow;
