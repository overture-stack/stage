// Docs.tsx
import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';
import { marked } from 'marked';
import defaultTheme from '../../theme';

const Docs = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	const documentation = `
# Data Management System Documentation

## Introduction
The Data Management System (DMS) is a comprehensive solution for managing research data. This documentation will guide you through its features and usage.

## Key Features
- **Secure Data Storage**: Enterprise-grade security for sensitive research data
- **Version Control**: Track changes and maintain data history
- **Collaboration Tools**: Work seamlessly with team members
- **Advanced Search**: Quickly find the data you need
- **Compliance**: Built-in tools for maintaining regulatory compliance
`;

	return (
		<section
			css={css`
				width: 100%;
				max-width: 1200px;
				margin: 20px auto;
				padding: 40px 60px;
				background-color: ${theme.colors.white};

				h1 {
					font-size: 2.2rem;
					font-weight: 500;
					margin-bottom: 1.5rem;
				}

				h2 {
					font-size: 1.6rem;
					font-weight: 500;
					margin: 2rem 0 1rem;
					padding-bottom: 0.5rem;
					border-bottom: 1px solid ${theme.colors.grey}20;
				}

				h3 {
					font-size: 1.3rem;
					font-weight: 500;
					margin: 1.5rem 0 1rem;
				}

				p {
					margin: 1rem 0;
					line-height: 1.6;
				}

				ul,
				ol {
					margin: 1rem 0;
					padding-left: 1.5rem;

					li {
						margin: 0.5rem 0;
						line-height: 1.6;
					}
				}

				code {
					background: ${theme.colors.grey}10;
					padding: 0.2rem 0.4rem;
					border-radius: 3px;
					font-family: monospace;
					font-size: 0.9em;
				}

				pre {
					background: ${theme.colors.grey}05;
					padding: 1rem;
					border-radius: 3px;
					overflow-x: auto;
					margin: 1rem 0;
					border: 1px solid ${theme.colors.grey}10;

					code {
						background: none;
						padding: 0;
					}
				}

				strong {
					font-weight: 500;
				}

				@media (max-width: 768px) {
					padding: 20px;
					margin: 10px;

					h1 {
						font-size: 2rem;
					}

					h2 {
						font-size: 1.4rem;
					}

					h3 {
						font-size: 1.2rem;
					}
				}
			`}
		>
			<div dangerouslySetInnerHTML={{ __html: marked(documentation) }} />
		</section>
	);
};

export default Docs;
