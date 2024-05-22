import React, { ReactNode } from 'react';
import { css } from '@emotion/react';
// Correctly import the SVG as a React component
import NotesIcon from './assets/notes.svg';

type NoteBoxProps = {
	children: ReactNode;
	title: string;
};

const NoteBox = ({ children, title, ...props }: NoteBoxProps) => {
	return (
		<div
			css={css`
				background-color: #04518c;
				padding: 10px 22px 10px 22px;
				margin-bottom: 24;
				border-radius: 10px;
				color: #fff;
			`}
			{...props}
		>
			<h3
				css={css`
					display: flex;
					align-items: center;
					font-weight: bold;
					margin-bottom: 12px;
				`}
			>
				{/* Use the imported SVG directly */}
				<img
					src={NotesIcon.src}
					alt="Notes Icon"
					css={css`
						height: 36px;
						margin-right: 12px;
					`}
				/>
				{title}
			</h3>
			<div
				css={css`
					font-size: 16px;
					font-weight: 400;
					line-height: 24px;
					margin-bottom: 16px;
					a {
						color: #fff;
						font-weight: 600;
					}
					code {
						background-color: rgb(0, 48, 85);
						font-family: Source Code Pro, monospace;
						font-size: 14px;
						font-weight: 600;
						line-height: 20px;
						padding: 2px 3px;
						box-sizing: border-box;
					}
				`}
			>
				{children}
			</div>
		</div>
	);
};

export default NoteBox;
