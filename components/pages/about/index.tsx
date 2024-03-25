import { ReactElement } from 'react';
import { useState } from 'react';

import PageLayout from '../../PageLayout';
import HeroBanner from './HeroBanner';
import PageContent from './PageContent';

const About = (): ReactElement => {
	const [articleId, setArticleId] = useState(null);

	const updateArticleId = (articleId) => setArticleId(articleId);

	return (
		<PageLayout subtitle="About This Portal">
			<HeroBanner updateFunction={updateArticleId} />
			<div>{articleId}</div>
			  
			<PageContent /> 
		</PageLayout>
	);
};

export default About;
