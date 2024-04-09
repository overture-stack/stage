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

const Content = ({ activeId }: { activeId: string }): ReactElement => {
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
						title="What is Overture?"
						text="Overture is a collection of open-source software made to improve the process of building and deploying platforms for minds and machines to collect and collaborate over massive genomics datasets. Overture platforms allow developers to build scalable and extensible data management platforms that enable researchers to collect, organize and share their data. By doing so, Overture platforms ensure data transparency, reproducibility, and reuse while maintaining oversight over distribution."
					/>
					<ArticleComponent
						title="Who uses Overture?"
						text="Overture's core functionalities are split between three categories of users: data consumers, who retrieve data from our platforms; providers, who submit data to our platforms; and administrators, who manage and configure the platform. From the navigation menu above you can find an overview of how each user interacts with our platforms. "
					/>
					<ArticleComponent
						title="How are our platforms built?"
						text="This Overture demo portal is built using six of our core software microservices:"
						imageUrl={overtureOverview.src}
						htmlContent="
						<strong>Ego</strong>, Overture's identity and permission management service, is being used to handle all user and application authentication and authorization, including our mock user login and API key generation. Alternatively, Overture can also be integrated with the third-party Oauth service, Keycloak. 

						<strong>Song and Score</strong> are being used to handle all data submission, management, and retrieval operations. With automated tracking and custom metadata validations, these services are central to Overture's ability to improve data quality, findability, and interoperability.

						<strong>Maestro</strong> indexes data from our Song metadata repositories into an Elasticsearch index.
						
						<strong>Arranger</strong> then uses this index to produce a graphQL search API that connects to our library of configurable arranger search components that can be seen from the data explorer.    
						 
						<strong>Stage</strong> combines these services into the react-based front-data portal UI you are currently reading from.
						
						<p>Choosing a microservice framework for Overture was a strategic decision that provides
						several key advantages:</p>

						<ul>
							<li>
								<strong> Scalability</strong> is enhanced by allowing individual system components
								to scale independently, ensuring efficient resource allocation.
							</li>
							<li>
								<strong> Flexibility</strong> is achieved through the ability to deploy and update
								each microservice separately, simplifying the development process and facilitating
								the introduction of new features or modifications.
							</li>
							<li>
								<strong> Resilience</strong> is maintained through fault isolation, ensuring that
								a single point of failure doesn't disrupt the entire system.
							</li>
						</ul>

						Overture microservices can be installed as individual Docker containers and are compatible with Linux, Mac (Intel & Apple Silicon), and Windows platforms. Users can deploy and access all services locally (limited to HTTP) or externally by using a custom domain name that supports HTTPS via TLS/SSL. All necessary configurations, including integration with other Overture microservices, are provided via environment variables. Documentation, including installation, configuration and usage guides, can be found on <a href=https://www.overture.bio/documentation/>our website linked here</a>.
					"
					/>
				</div>
			)}
			{/* How our platforms are used */}
			{activeId === 'usage' && (
				<div>
					<ArticleComponent
						title="Data Retrieval"
						text="This is a read-only demo environment with a default user login and API Key. As such, you can follow the instructions below and download our mock data as a typical user would."
						htmlContent='

						<strong>1. Create a data subset:</strong>
						
						<p>From the exploration page, use the search facets in the left-hand panel to refine your search. All your filtering parameters are visible at the top query bar, ensuring you have a clear overview of your search criteria. To share your queries, you can simply copy the browser URL, which dynamically updates with your filter parameters. The filtered data subset is displayed within a sortable data table.</p>
						
						<strong>2. Generate a manifest:</strong>
						
						<p>Select the download dropdown, and click file manifest. This manifest tsv is used for downloading directly from the resources database and object storage using the Overture’s CLI tools, specifically the Song and Score clients. We use CLI tools as massive genomic datasets require reliable multi-part download sessions unsuitable for a browser.</p>
						
						<strong>3. Set up the Score-client:</strong>
						
						<p>Please make sure that you have Docker installed and running. You can follow the Official Docker Engine download & installation instructions or download and install the Docker desktop application.</p>
						
						<p>To run the Score-Client run the following command:</p>
						
						<code>docker run -d -it \ </br>
								--name score-client \ </br>
								-e CLIENT_ACCESS_TOKEN=${token} \ </br>
								-e STORAGE_URL=https://score.demo.overture.bio \ </br>
								-e METADATA_URL=https://song.demo.overture.bio \ </br>
								--network="host" \ </br>
								--mount type=bind,source="$(pwd)",target=/output \ </br>
								ghcr.io/overture-stack/score:latest
						</code>
			
						<p><strong>4. Download your data:</strong></p>
						
						<p>With the Score-Client running run the following command:</p>
						
						<code>
						docker exec score-client sh -c "score-client download --manifest ./<manifestDirectory>/manifest.txt --output-dir ./<outputDirectory>"
						</code>
						
						<ul>
						
							<li>Replace <manifestDirectory>  with the path of the earlier generated manifest file</li>
						<li> Replace <outputDirectory>  with the path in which you want files to download to </li>
						</ul>
						
						<p><strong>Note on authentication:</strong> Typically you will require authorization from an administrator prior to accessing any given resource. Upon approval, researchers can access the portal by selecting the login button at the top of the screen. Since this demo portal is an open-access resource, no login information is required, For more information on access mangement using Overture, select the login button at the top right of the portal page.</p>
						'
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
