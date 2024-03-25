import React, { useRef, useState } from 'react';
import { css, useTheme } from '@emotion/react';

interface TerminalProps {
	command: string;
}

const Terminal: React.FC<TerminalProps> = ({ command }) => {
	const terminalRef = useRef<HTMLDivElement>(null);
	const [copied, setCopied] = useState(false);
	const theme = useTheme();

	const handleCopy = () => {
		if (terminalRef.current) {
			const commandText = command;
			navigator.clipboard.writeText(commandText);
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 3000);
		}
	};

	return (
		<div
			ref={terminalRef}
			css={css`
				background-color: #1e1e1e;
				color: #d4d4d4;
				border-radius: 5px;
				padding: 20px;
				position: relative;
				font-family: 'Courier New', Courier, monospace;
				font-size: 14px;
				line-height: 1.4;
				overflow: hidden;
				max-width: 600px;
			`}
		>
			<button
				onClick={handleCopy}
				css={css`
					background-color: ${copied ? theme.colors.grey_5 : theme.colors.accent_light};
					border: none;
					border-radius: 3px;
					padding: 5px 10px;
					position: absolute;
					top: 5px;
					right: 5px;
					cursor: pointer;
					user-select: none;
					color: ${theme.colors.white};
				`}
			>
				{copied ? 'Copied' : 'Copy'}
			</button>
			<pre
				css={css`
					margin: 0;
					white-space: pre-wrap;
					word-wrap: break-word;
					font-family: 'Courier New', Courier, monospace;
					color: ${theme.colors.white};
				`}
			>
				{command}
			</pre>
		</div>
	);
};

export default Terminal;
