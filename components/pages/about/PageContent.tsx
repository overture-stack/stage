import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';

import defaultTheme from '../../theme';
import ArticleComponent from './ArticleComponent';

import overtureOverview from './assets/overview-comp.png';
import retrievalOverview from './assets/dataretrieval.png';
import submissionOverview from './assets/submission.png';
import SwaggerUI from 'swagger-ui-react';

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
						imageUrl={overtureOverview.src}
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
					<ArticleComponent
						title="Data Submission"
						imageUrl={overtureOverview.src}
						text="Please note that this portal is a read-only resource. You cannot submit data to this demo environment. We are currently developing an easy-to-install quickstart environment that can be spun up locally with read and write permissions. To get updates join our Slack channel linked within the footer."
						htmlContent="

						<p>The following information provides a high-level overview of the data submission process. For detailed information on using Song and Score, including installing the clients and uploading data, see our documentation here.</p>

						<strong>1. Prepare your Analysis:</strong>

						<p>An analysis in Overture consists of one or more files along with metadata describing these files. Data submitters organize their metadata using a spreadsheet editor alongside a data dictionary provided by the resource administrator. The data dictionary outlines the required metadata fields and their syntax.</p>

						<strong>2. Upload your metadata:</strong>

						<p>The completed analysis file is uploaded as a JSON document using the Song CLI tool. A single command validates the metadata payload against the resource's data model. If validation fails, error messages detailing the issues are provided. Upon successful validation, the payload gets committed to the database and the user is returned an auto-generated analysis ID.</p>

						<strong>3. Upload your file data:</strong>

						<p>A file manifest is generated using the Song client, specifying the directory containing the files and the analysis ID provided on the successful submission of your analysis file. This process ensures that all metadata can be tracked, using Song's analysis ID, to the corresponding file data stored in the cloud. The files are uploaded to object storage using the generated and verified manifest with the Score CLI upload command.</p>

						<strong>4. When ready, publish your data:</strong>

						<p>Publication controls allow administrators and data providers to coordinate and prepare data releases in a predictable and timely manner. Analyses are, by default, unpublished and can be published or suppressed depending on the availability of your desired data.</p>
						"
					/>
				</div>
			)}
			{/* How our platforms are built*/}
			{activeId === 'build' && (
				<div>
					<ArticleComponent
						title="Data Administration"
						text="Administrators have the freedom to
						tailor the platforms data model to their specific needs, ensuring that the data structure
						aligns with their project's requirements. By defining their own data model,
						administrators can ensure that all data submitted to the system adheres to a
						consistent structure."
						imageUrl={overtureOverview.src}
						htmlContent="<p>All data admin duties are primarily done through Song and Score. Score facilitates file data management, while Song handles metadata submission, validation, and tracking. With Song, administrators can tailor the platform's data model to their needs, ensuring the data structure aligns with their project's requirements.</p>

						<p>To achieve this, Song uses JSON Schema to describe the metadata structure of the resource. Data is submitted to Song in JSON format and undergoes validation against the data model schema. This schema ensures the presence of required fields and validates the contents of each field, ensuring adherence to the desired data type and allowed values. This validation process preserves the integrity and quality of the metadata within Song.</p>
						
						<p>The schema associated with the analysis type consists of two parts:</p>
						
						<ol>
						<li>A minimal <strong>base schema</strong> containing the essential fields for all analyses, including primary patient data, submitter IDs, and file details.</li>
						<li>A flexible, <strong>dynamic schema</strong> that the Song administrator can configure and upload to define specific analysis types.</li>
						</ol>
						
						<p>These schema components ensure accurate and consistent metadata validation within Song. When submitting an analysis to Song, the data provider tags an 'analysis type' to dictate the data model used for validation.</p>
						
						<p>All Overture microservices leverage Swagger UIs to ease interaction and enable development with our APIs. The Song Swagger UI for this demo portal can be accessed from https://song.demo.overture.bio</p>
						"
					/>
					<ArticleComponent
						title="Portal Configuration"
						text=""
						htmlContent="
						<p>
							<strong>Data Explorer Customization: </strong> Accommodating a flexible data model
							must also extend to a flexible representation of the data from the portal search
							interface. The ability to customize arrangers' search components gives
							administrators the ability to customize what search facets and data columns,
							making it easier for data consumers to navigate and interact with the resource.
						</p>
						<p>
							<strong>Portal Customization:</strong> With the flexibility to theme and extend
							the Stage UI, administrators can tailor the portal's content for various use
							cases. This includes adding custom pages and menu options that provide valuable
							information or resources, enhancing the portal's overall utility and appeal.
						</p>"
					/>
					<ArticleComponent
						title="Managing Users and Applications:"
						text="	The ability to manage user permissions through Ego or KeyCloak ensures that only authorized users can access
						the data and applications. This is crucial for maintaining the security and
						confidentiality of potentially sensitive genomics data. By applying role-based
						permissions, administrators can precisely control what each user or application
						can do within the system. This granular control allows for a more secure and
						efficient data management process, ensuring that users only have access to the
						data and functionalities they need."
					/>
				</div>
			)}
		</main>
	);
};

export default Content;
