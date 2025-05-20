import { css } from '@emotion/react';
import { flexRender, HeaderGroup } from '@tanstack/react-table';

type Props<T> = {
    headerGroup: HeaderGroup<T>;
};

const thStyle = css`
    background: #e5edf3;
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #dcdcdc;
`;

const TableHeader = <T,>({ headerGroup }: Props<T>) => {
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
