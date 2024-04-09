import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';
import 'swagger-ui-react/swagger-ui.css';

import overtureOverview from './assets/overview-comp.png';
import retrievalOverview from './assets/dataretrieval.png';
import submissionOverview from './assets/submission.png';
import StyledLink, { InternalLink as Link } from '../../Link';
import { SCORE_DOCS, SUBMISSION_DOCS } from '@/global/utils/constants';

import SwaggerEndpoint from './SwaggerEndpoint';

import defaultTheme from '../../theme';
import ArticleComponent from './ArticleComponent';

const Content = ({ activeId }: { activeId: string | 'overview' }): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<main
			css={css`
				width: 100%;
				background-color: ${theme.colors.white};
				padding-bottom: ${theme.dimensions.footer.height}px;
			`}
		>
			{/* Demo Portal Overview */}
			{activeId === 'overview' && (
				<div>
					<ArticleComponent
						title="Demo Portal"
						text="This Overture Demo Portal is a publically availableread-only resource, "
					/>

					<ArticleComponent
						title="What is Overture?"
						text="Overture is a collection of flexible, open-source software microservices that improve
						and simplify the process of building and deploying online platforms for researchers to
						gather, organize, and share genomics data."
					/>
					<ArticleComponent
						title="Who is Overture for?"
						text="We designed and developed the Overture suite to simplify the development and
						deployment of large-scale data platforms. These data platforms enable research groups
						to efficiently organize and share genomics data globally, helping researchers maximize
						the potential of existing data by ensuring its transparency, reproducibility, and
						reuse all while retaining oversight over its distribution."
					/>
					<ArticleComponent
						title="Who uses Overture?"
						text="Overture core functionalities are split between three categories of users:"
						htmlContent="<ol type=1>
						<li>
						Data consumers,
						<strong>
							<em>retrieving data from the platform</em>
						</strong>
					</li>
					<li>
						Data providers,
						<strong>
							<em>submitting data to the platform</em>
						</strong>
					</li>
					<li>
						Data administrators,
						<strong>
							<em>managing and configuring the platform</em>
						</strong>
						</li>
					</ol>"
					/>
				</div>
			)}
			{/* How our platforms are used */}
			{activeId === 'usage' && (
				<div>
					<ArticleComponent
						title="Data Retrieval"
						text="Data Retrieval using Overture-based platforms is designed to be user-friendly and efficient, catering to closed-access and open-access data scenarios. Open-access data, such as pathogen datasets, is readily accessible to any user with the URL to the resource. For closed-access data, researchers need authorization from an administrator to access the resource. Upon approval, researchers can access the portal by navigating to the public URL and selecting the login button located at the top of the screen. They can then log in to the web portal using popular identity providers, including Google, ORiD, GitHub or using the GA4GH passport system [REF]. From the Overture data exploration page, users can filter data using the left-hand panel's search facets which allow for the rapid and efficient filtering of data using checkboxes, data ranges, sliders, and quick search input boxes. These search facets enable users to narrow their queries and focus on relevant data subsets. Filtered datasets are presented in a data table which provides sortable columns, file counts, and pagination. All query parameters are summarized within a filter panel at the top of the page, giving users a clear overview of their search criteria. Users can easily share these queries using the browser URL, which gets updated with the filter parameters in real time. This enhances collaboration and allows data filtering to be reproducible. Once the users have identified relevant data, they can select the download dropdown, which provides options for downloading metadata or a file manifest in a TSV format. The manifest file allows users to download their files of interest directly from the resources database and object storage using Overure’s CLI tools, specifically the Song and Score clients. These CLI tools are needed as massive genomic datasets require reliable multi-part download sessions unsuitable for a browser. To ensure secure access to data, users must supply a valid API key when installing the Song and Score clients. This key can be obtained after logging in to the data portal and navigating to the profile page."
						imageUrl={overtureOverview.src}
					/>
					<ArticleComponent
						title="Data Submission"
						text="Data Retrieval using Overture-based platforms is designed to be user-friendly and efficient, catering to closed-access and open-access data scenarios. Open-access data, such as pathogen datasets, is readily accessible to any user with the URL to the resource. For closed-access data, researchers need authorization from an administrator to access the resource. Upon approval, researchers can access the portal by navigating to the public URL and selecting the login button located at the top of the screen. They can then log in to the web portal using popular identity providers, including Google, ORiD, GitHub or using the GA4GH passport system [REF]. From the Overture data exploration page, users can filter data using the left-hand panel's search facets which allow for the rapid and efficient filtering of data using checkboxes, data ranges, sliders, and quick search input boxes. These search facets enable users to narrow their queries and focus on relevant data subsets. Filtered datasets are presented in a data table which provides sortable columns, file counts, and pagination. All query parameters are summarized within a filter panel at the top of the page, giving users a clear overview of their search criteria. Users can easily share these queries using the browser URL, which gets updated with the filter parameters in real time. This enhances collaboration and allows data filtering to be reproducible. Once the users have identified relevant data, they can select the download dropdown, which provides options for downloading metadata or a file manifest in a TSV format. The manifest file allows users to download their files of interest directly from the resources database and object storage using Overure’s CLI tools, specifically the Song and Score clients. These CLI tools are needed as massive genomic datasets require reliable multi-part download sessions unsuitable for a browser. To ensure secure access to data, users must supply a valid API key when installing the Song and Score clients. This key can be obtained after logging in to the data portal and navigating to the profile page."
						imageUrl={overtureOverview.src}
					/>
				</div>
			)}
			{/* How our platforms are built*/}
			{activeId === 'build' && (
				<ArticleComponent
					title="Q: How are Overture data platforms built?"
					text="This demo portal was built using six core Overture microservices including Stage, Arrangers, Keycloak or Ego, Song, Score, and Maestro. Stage: is the customizable front-ends user interface including prebuilt components (ex. Navbar and Footer), theming, and login, profile, and exploration pages. Arranger Components: are our library of search UI components made to integrate with Stages data expolorer page. Components include a configurable search facet panel, data table, and filter summary panel. Arranger Server: Uses this index to produce a GraphQL search API that connects with its front-end library components on the data exploration page. This API enables users to perform complex queries and retrieve data in a structured and efficient manner. Song and Score: Responsible for data management, retrieval, and submission. Score is tasked with transferring large genomic files from object storage, while Song handles the organization of metadata stored within its database. This separation of concerns allows for efficient data handling and retrieval. Maestro: Indexes data from a distributed network of Song metadata repositories into a unified Elasticsearch index. This centralized indexing facilitates faster and more efficient data searches. Autherization & Authentication: Overture can integrate with Keycloak or Ego, which provide security and enable accessibility with authentication and authorization for users and applications. This ensures that only authorized users can access the system and its data."
					imageUrl={overtureOverview.src}
				/>
			)}
		</main>
	);
};

export default Content;
