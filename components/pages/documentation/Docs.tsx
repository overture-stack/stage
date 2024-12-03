import { ReactElement } from 'react';
import { css } from '@emotion/react';
import { marked } from 'marked';
import defaultTheme from '../../theme';

interface Section {
	title: string;
	content: string;
}

const documentationSections: Section[] = [
	{
		title: 'Portal Overview',
		content: `

# Overview

The platform's four-component architecture enables researchers to process and analyze large-scale drug discovery data through a unified portal. The backend ingests multi-gigabyte TSV files containing tabular data, while the frontend provides a highly available interface for querying, filtering, and exporting the aggregated data.

<img src="/images/submissionsystem-Drug-Discovery.png" alt="System Architecture Diagram" title="System Architecture Diagram" />

## Key Components

- The **Data Ingestion Utility** is used to submit data in the form of TSVs to any Elasticsearch index through the command-line.

- **Elasticsearch** powers the platform's core search engine functionality.

- **Arranger Server** enables Elasticsearch to be queried from a flexible GraphQL API, this is used by our frontend services to retrieve data from Elasticsearch.

- **Stage** is the front-end web portal scaffolding. It includes our navbars, footers, as well as custom pages such as this sites landing page and this documentation page.

- **Arranger Components** are the react components responsible for our interactive search UIs found on the exploration pages, these components communicate with the Arranger Server to fetch and display data.

<a href="https://github.com/oicr-softeng/drug_discovery-ui/" target="_blank" rel="noopener">The repository for the portal can be found on GitHub here</a>, If you require access to the repository please contact the administrator of the platform.
    `,
	},
	{
		title: 'Submitting Data',
		content: `

# Data Submission

## TSV Processing Utility Guide

### Basic Usage

<code> tsv-processor -f path/to/your/data.tsv </code>


### Parameters

#### Required
* -f, --file: Path to your TSV (tab-separated values) file

#### Optional
* --url: Elasticsearch URL (default: http://localhost:9200)
* -i, --index: Name for the Elasticsearch index (default: correlation-index)
* -u, --user: Elasticsearch username (default: elastic)
* -p, --password: Elasticsearch password (default: myelasticpassword)
* -b, --batch-size: Number of records to process in each batch (default: 50)

## Example
bash
tsv-processor -f data.tsv -i my-index -b 100

## Process

1. Counts total records in your file
2. Displays and asks for header confirmation
3. Shows progress bar during processing
4. Provides real-time statistics:
   * Processing speed
   * Estimated time remaining
5. Displays completion summary with any failed records

## Note
Your TSV file must have headers in the first row and be properly tab-separated.
    `,
	},
	{
		title: 'Customizing the Portal',
		content: `

# Customizing the Portal

Review these essential configuration guides for portal customization:

- <a href="https://docs.overture.bio/guides/administration-guides/customizing-the-data-portal" target="_blank" rel="noopener">Index Mappings</a>: Understand what Index mappings are and how to configure them

- <a href="https://docs.overture.bio/guides/administration-guides/index-mappings" target="_blank" rel="noopener">Search Portal Customization</a>: Learn how to customize how data is displayed in your front-end data facets and table components

    `,
	},
	{
		title: 'Next Steps',
		content: `
		
# Next Steps

As part of the Pan-Canadian Genome Library project we are currently working on releasing a robust new data submission system, specifically designed to manage tabular data management. For details, see our <a href="https://docs.overture.bio/docs/und" target="_blank" rel="noopener">relevant documentation linked here</a>.

<img src="/images/submissionsystem-2.png" alt="New Submission System Architecture Diagram" title="New Submission System Architecture Diagram" />
		`,
	},
	{
		title: 'Developer Note',
		content: `

# Developer Note

Documentation on the software used and customized for this project can be found from the <a href="https://github.com/oicr-softeng/drug_discovery-ui/" target="_blank" rel="noopener">github repositories readme</a>. All customized utilities and components are outlined and further documented with inline comments.

	`,
	},
	{
		title: 'Support',
		content: `
# Support

If you have any questions please don't hesitate to reach out through our <a href="https://docs.overture.bio/community/support" target="_blank" rel="noopener">relevant community support channels</a>. 

- Using public support channels helps us track issues and demonstrates active community engagement, a key indicator of project health.
- For private inquiries, please reach out through OICR Slack or contact@overture.bio.
    `,
	},
];

const styles = {
	container: css`
		padding: 2rem 0;
		background-color: ${defaultTheme.colors.main};
		max-width: 1200px;
		margin: 0 auto;
	`,
	contentWrapper: css`
		width: 100%;
		display: flex;
		gap: 2rem;
		padding: 0 1rem;

		@media (max-width: 768px) {
			flex-direction: column;
		}
	`,
	mainContent: css`
		flex: 1;
		min-width: 0;
	`,
	navWrapper: css`
		width: 250px;
		flex-shrink: 0;
		height: fit-content;
		position: sticky;
		top: 2rem;

		@media (max-width: 768px) {
			width: 100%;
			position: relative;
			top: 0;
		}
	`,
	navigation: css`
		background-color: ${defaultTheme.colors.white};
		padding: 1rem 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 0;

		ul {
			list-style: none;
			padding: 0;
			margin: 0;

			@media (max-width: 768px) {
				display: flex;
				gap: 2rem;
			}

			@media (max-width: 600px) {
				flex-direction: column;
				gap: 1rem;
			}
		}

		li a {
			color: ${defaultTheme.colors.button};
			text-decoration: none;
			font-weight: 600;
			display: block;
			padding: 0.5rem 0;

			&:hover {
				text-decoration: underline;
			}
		}
	`,

	section: css`
		background-color: ${defaultTheme.colors.white};
		padding: 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;

		h1 {
			color: ${defaultTheme.colors.button};
			font-size: 1.5rem;
			font-weight: 700;
			margin-bottom: 1.5rem;
		}

		h2 {
			font-size: 1.2rem;
			font-weight: 500;
			margin: 1.5rem 0 1rem;
			padding-bottom: 0.5rem;
			border-bottom: 1px solid ${defaultTheme.colors.main}20;
		}

		p {
			font-size: 1rem;
			margin: 1rem 0;
			line-height: 1.6;
			color: ${defaultTheme.colors.black};
			opacity: 0.8;
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

		/* Inline code */
		:not(pre) > code {
			background: ${defaultTheme.colors.main}10;
			padding: 0.2rem 0.4rem;
			border-radius: 3px;
			font-size: 0.9em;
			color: ${defaultTheme.colors.button};
			font-family: monospace;
		}

		/* Block code */
		pre {
			background: ${defaultTheme.colors.main}05;
			border: 1px solid ${defaultTheme.colors.main}20;
			border-radius: 6px;
			padding: 1.5rem;
			margin: 1.5rem 0;
			overflow-x: auto;
			position: relative;

			&::before {
				content: 'code';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				padding: 0.5rem 1rem;
				background: ${defaultTheme.colors.main}10;
				border-bottom: 1px solid ${defaultTheme.colors.main}20;
				font-family: monospace;
				font-size: 0.9em;
				color: ${defaultTheme.colors.button};
				text-transform: uppercase;
			}
			code {
				padding-top: 1.5rem;
				display: block;
				font-family: monospace;
				line-height: 1.6;
			}
		}
		img {
			width: 90%;
			max-width: 800px;
			height: auto;
			margin: 2rem auto;
			border-radius: 6px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			display: block;

			@media (max-width: 1024px) {
				width: 95%;
				padding: 0.75rem;
			}

			@media (max-width: 768px) {
				width: 100%;
				padding: 0.5rem;
			}
		}
	`,
};

const Documentation = (): ReactElement => {
	return (
		<section css={styles.container}>
			<div css={styles.contentWrapper}>
				<div css={styles.navWrapper}>
					<nav css={styles.navigation}>
						<ul>
							{documentationSections.map((section, index) => (
								<li key={index}>
									<a href={`#${section.title.toLowerCase().replace(/\s+/g, '-')}`}>{section.title}</a>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div css={styles.mainContent}>
					{documentationSections.map((section, index) => (
						<section key={index} css={styles.section} id={section.title.toLowerCase().replace(/\s+/g, '-')}>
							<div dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
						</section>
					))}
				</div>
			</div>
		</section>
	);
};

export default Documentation;
