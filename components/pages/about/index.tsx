import { ReactElement } from 'react';
import { useState } from 'react';

import PageLayout from '../../PageLayout';
import HeroBanner from './HeroComponent';
import PageContent from './PageContent';

const About = (): ReactElement => {
	const [articleId, setArticleId] = useState<string>('software');

	const activeArticleId = (articleId: string) => setArticleId(articleId);

	return (
		<PageLayout subtitle="About This Portal">
			<HeroBanner setArticleID={activeArticleId} activeId={articleId} />
			<div>{activeArticleId}</div>
			<PageContent activeId={articleId} /> 
		</PageLayout>
	);
};

export default About;
