import { css } from '@emotion/react';

export const sectionStyle = css`
	margin-bottom: 48px;
	max-width: 1200px;
`;

export const schemaTitle = css`
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 10px;
`;

export const schemaDescription = css`
	font-size: 14px;
	color: #555;
	margin-bottom: 20px;
`;

export const thStyle = css`
	background: #e5edf3;
	text-align: left;
	padding: 12px;
	border-bottom: 1px solid #dcdcdc;
`;
export const tableStyle = css`
	width: 100%;
	border-collapse: collapse;
	margin-top: 8px;
`;
export const tdStyle = css`
	padding: 12px;
	border-bottom: 1px solid #eaeaea;
	max-width: 30vw;
	white-space: pre-wrap;
	overflow-wrap: break-word;
	word-break: break-word;
	vertical-align: top;
`;

export const rowStyle = (index: number) => css`
	background-color: ${index % 2 === 0 ? '' : '#F5F7F8'};
`;

export const linkStyle = css`
	color: #0b75a2;
	font-size: 12px;
	cursor: pointer;
	margin-left: 6px;

	&:hover {
		text-decoration: underline;
	}
`;

export const fieldNameStyle = css`
	font-weight: 600;
`;

export const fieldDescStyle = css`
	font-size: 12px;
	color: #666;
`;
