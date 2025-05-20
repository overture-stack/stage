import { css } from '@emotion/react';
import { Row, flexRender } from '@tanstack/react-table';
import { useState } from 'react';

type Props<T> = {
	row: Row<T>;
	index: number;
};

const tdStyle = css`
	padding: 12px;
	border-bottom: 1px solid #eaeaea;
	max-width: 30vw;
	white-space: pre-wrap;
	overflow-wrap: break-word;
	word-break: break-word;
	vertical-align: top;
`;

const rowStyle = (index: number) => css`
	background-color: ${index % 2 === 0 ? '' : '#F5F7F8'};
`;

const linkStyle = css`
	color: #0b75a2;
	font-size: 12px;
	cursor: pointer;
	margin-left: 6px;

	&:hover {
		text-decoration: underline;
	}
`;

const TableRow = <T,>({ row, index }: Props<T>) => {
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

				if (cellValue === undefined || cellValue === null || cellValue === '')
					return <td key={cell.id} css={tdStyle}></td>;

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
