import { ReactElement } from 'react';
import { css } from '@emotion/react';
import defaultTheme from '../../theme';

interface Product {
	title: string;
	link: string;
	category: string;
}

interface Category {
	title: string;
	description: string;
}

const categories: Record<string, Category> = {
	data: {
		title: 'Explore The Data',
		description: 'The central place to filter, download & share our data.',
	},
	documentation: {
		title: 'Documentation',
		description: 'Documentation covering basic platform usage.',
	},
};

const products: Product[] = [
	// Data Category
	{
		title: 'Correlation Data',
		link: '/correlation',
		category: 'data',
	},
	{
		title: 'Mutation Data',
		link: '/mutation',
		category: 'data',
	},
	{
		title: 'mRNA Data',
		link: '/mrna',
		category: 'data',
	},
	{
		title: 'STRING Data',
		link: '/string',
		category: 'data',
	},
	// Documentation Category
	{
		title: 'Data Submission',
		link: '/documentation',
		category: 'documentation',
	},
	{
		title: 'Portal Customization',
		link: '/documentation',
		category: 'documentation',
	},
];

const styles = {
	siteMap: css`
		padding: 2rem 0;
		background-color: ${defaultTheme.colors.main};
	`,
	container: css`
		width: 100%;
		max-width: 1300px;
	`,
	categorySection: css`
		background-color: ${defaultTheme.colors.white};
		border-radius: 15px;
		padding: 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	`,
	categoryHeader: css`
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: ${defaultTheme.colors.hero};
	`,
	categorySubheader: css`
		font-size: 1rem;
		opacity: 0.8;
		color: ${defaultTheme.colors.black};
		margin-bottom: 1.5rem;
	`,
	cardGrid: css`
		display: grid;
		grid-template-columns: repeat(4, 1fr); // Data category: 4 cards
		gap: 1rem;

		&[data-category='documentation'] {
			grid-template-columns: repeat(2, 1fr); // Documentation category: 2 cards
		}

		@media (max-width: 1200px) {
			grid-template-columns: repeat(2, 1fr);
			&[data-category='documentation'] {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media (max-width: 600px) {
			grid-template-columns: 1fr;
			&[data-category='documentation'] {
				grid-template-columns: 1fr;
			}
		}
	`,
	card: css`
		display: flex;
		flex-direction: column;
		justify-content: center; // Center vertically
		align-items: center; // Center horizontally
		padding: 1.5rem;
		border-radius: 10px;
		background-color: ${defaultTheme.colors.button};
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		text-decoration: none;
		color: ${defaultTheme.colors.black};

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
		}
	`,
	cardTitle: css`
		font-size: 1rem;
		font-weight: 600;
		text-align: center; // Center the text
		margin: 0; // Remove any default margins
	`,
};

const Card = ({ title, link }: Product) => (
	<a href={link} css={styles.card}>
		<p css={styles.cardTitle}>{title}</p>
	</a>
);

const CategorySection = ({ category, items }: { category: string; items: Product[] }) => {
	if (!categories[category]) {
		return null;
	}

	return (
		<div css={styles.categorySection}>
			<h2 css={styles.categoryHeader}>{categories[category].title}</h2>
			<p css={styles.categorySubheader}>{categories[category].description}</p>
			<div css={styles.cardGrid} data-category={category}>
				{items.map((props, idx) => (
					<Card key={idx} {...props} />
				))}
			</div>
		</div>
	);
};

const SiteMap = (): ReactElement => {
	const categorizedProducts = products.reduce((acc, product) => {
		(acc[product.category] = acc[product.category] || []).push(product);
		return acc;
	}, {} as Record<string, Product[]>);

	return (
		<section css={styles.siteMap}>
			<div css={styles.container}>
				<CategorySection category="data" items={categorizedProducts.data || []} />
				<CategorySection category="documentation" items={categorizedProducts.documentation || []} />
			</div>
		</section>
	);
};

export default SiteMap;
