import { ReactElement } from 'react';
import { useState } from 'react';

import PageLayout from '../../PageLayout';
import HeroBanner from './HeroComponent';
import PageContent from './PageContent';
interface ArticleProps {
	articleId: string;
}

const About = (): ReactElement => {
	const [articleId, setArticleId] = useState<string | null>(null);

	const activeArticleId = (articleId: string) => setArticleId(articleId);

	return (
		<PageLayout subtitle="About This Portal">
			<HeroBanner setArticleID={activeArticleId} />
			<div>{activeArticleId}</div>
			<PageContent activeId={articleId} /> 
		</PageLayout>
	);
};

export default About;
