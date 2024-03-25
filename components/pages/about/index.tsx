import { ReactElement } from 'react';

import PageLayout from '../../PageLayout';
import HeroBanner from './HeroBanner';
import PageContent from './PageContent';

const About = (): ReactElement => (
	<PageLayout subtitle="About This Portal">
		<HeroBanner />
		  
		<PageContent /> 
	</PageLayout>
);

export default About;
