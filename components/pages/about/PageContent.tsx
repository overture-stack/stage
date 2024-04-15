import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';

import defaultTheme from '../../theme';
import ArticleComponent from './ArticleComponent';

import overtureOverview from './assets/portalOverview.png';
import retrievalOverview from './assets/dataretrieval.png';
import submissionOverview from './assets/dataSubmission.png';
import dataAdmin from './assets/dataAdmin.png';
import arrangerConfigs from './assets/arrangerConfigs.png';
import stageUI from './assets/stageUI.png';
import ego from './assets/ego.png';

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
						text="Overture is a collection of open-source software used to overcome significant obstacles in storing, managing, and sharing genome-scale datasets. Developers use Overture  to build and deploy scalable and extensible data platforms while researchers use these platforms to collect, organize and share their data."
					/>
					<ArticleComponent
						title="How are our platforms built?"
						text="Our six core microservices, Ego, Song, Score, Maestro, Arranger and Stage, combine to build end-to-end data platforms. Here is how the our services are being used to build out this demo portal:"
						imageUrl={overtureOverview.src}
					>
						<p>
							<strong>Ego</strong>, is our identity and permission management service, broadly
							enabling authorization and authentication of all user users and applications. Overture
							can also integrate with third-party Oauth service, Keycloak.{' '}
							<strong>Song and Score</strong> manage data submission, management, and retrieval,
							automating file-to-metadata tracking and validating data submissions against a
							customizable model. These services enhance data quality, findability, and
							interoperability. <strong>Maestro</strong> indexes submitted metadata from the Song
							repository into an Elasticsearch index. <strong>Arranger</strong> references this
							index to produce a GraphQL search API, connected to our configurable search UI
							components on the data exploration page. <strong>Stage</strong> integrates these
							services into the React-based front-data portal UI you're currently viewing.
						</p>
					</ArticleComponent>
				</div>
			)}
			{/* How our platforms are used */}
			{activeId === 'usage' && (
				<div>
					<ArticleComponent
						title="Data Retrieval"
						text="This is a read-only demo environment with a default user login and API Key. As such, you can follow the instructions below and download our mock data as a typical user would."
						imageUrl={retrievalOverview.src}
					>
						<div
							css={css`
								code {
									background-color: ${theme.colors.black};
									border-radius: 10px;
									padding: 25px 25px;
									font-family: 'Courier New', Courier, monospace;
									font-size: 12px;
									color: ${theme.colors.white};
									display: inline-block;
									margin: 0 5px;
									border: 1px solid ${theme.colors.accent};
								}
							`}
						>
							<p>
								<strong>1. Create a data subset:</strong> From the exploration page, use the search
								facets in the left-hand panel to refine your search. All your filtering parameters
								are visible at the top query bar, ensuring you have a clear overview of your search
								criteria. To share your queries, you can simply copy the browser URL, which
								dynamically updates as you filter through the dataset.
							</p>

							<p>
								<strong>2. Generate a manifest:</strong> Select the download dropdown, and click
								file manifest. The downloaded file manifest will be used next to download the data
								with our Score Client CLI tool. We use CLI tools as massive genomic datasets require
								reliable multi-part download sessions unsuitable for a browser.
							</p>

							<p>
								<strong>3. Run the Score-client:</strong> With Docker installed, the Score client is
								run using the following command:
							</p>

							<code>
								docker run -d -it \ <br></br>
								--name score-client \ <br></br>
								-e CLIENT_ACCESS_TOKEN=$token \<br></br>
								-e STORAGE_URL=https://score.demo.overture.bio \<br></br>
								-e METADATA_URL=https:"//"song.demo.overture.bio \<br></br>
								--network="host" \<br></br>
								--mount type=bind,source="$(pwd)",target=/output \<br></br>
								ghcr.io/overture-stack/score:latest
							</code>

							<p>
								<strong>4. Download your data:</strong> You can download the data outlined in your
								manifest file by running the following command:
							</p>

							<code>
								docker exec score-client sh -c "score-client download \<br></br>
								--manifest ./manifestDirectory/manifest.txt \<br></br>
								--output-dir ./outputDirectory"
							</code>

							<ul>
								<li>
									Replace <em>manifestDirectory </em> with the path that points to your manifest
									file
								</li>
								<li>
									Replace the <em>outputDirectory </em> with your desired download destination
								</li>
							</ul>

							<p>
								<strong>Note on authentication:</strong> Typically you will require authorization
								from an administrator prior to accessing any given resource. Upon approval,
								researchers can access the portal by selecting the login button at the top of the
								screen. Since this demo portal is an open-access resource, no login information is
								required.
							</p>
						</div>
					</ArticleComponent>

					<ArticleComponent
						title="Data Submission"
						text="Public users do not have the required permissions to submit data to this demo portal. To enable full access we are currently developing an easy-to-install quickstart. To get updates join our Slack channel linked within the footer. 							The following information provides a high-level overview of the data submission
						process."
						imageUrl={submissionOverview.src}
					>
						<p>
							{' '}
							The initial step in data submission involves{' '}
							<strong>preparing an analysis file.</strong> In Overture, an analysis consists of one
							or more files along with metadata. Data submitters typically use a spreadsheet editor,
							complemented by a data dictionary provided by the resource administrator, to organize
							their metadata. This dictionary outlines the required metadata fields and their
							syntax. Following this, <strong>the analysis file is uploaded</strong> as a JSON
							document via the Song CLI tool. A single command validates the metadata against the
							resource's data model. Upon successful validation, the payload is committed to the
							database, and the user receives an auto-generated analysis ID. Subsequently, the user{' '}
							<strong>generates a file manifest</strong> using the Song client's manifest command,
							which necessitates specifying the directory of the files and a valid analysis ID. This
							process enables Song to link all metadata within its database to the corresponding
							file data stored in the cloud. Finally,{' '}
							<strong>the files are uploaded to object storage</strong> using the verified manifest
							with the Score CLI upload command. Additional publication controls allow
							administrators and data providers to manage data releases predictably and timely.
							Analyses are unpublished by default and can be published or suppressed using the Song
							Client.{' '}
						</p>
						<p>
							For detailed information on using Song and Score, including installing the clients and
							uploading data, see our documentation here.
						</p>
					</ArticleComponent>
				</div>
			)}
			{/* Data Administration & Portal Configuration */}
			{activeId === 'build' && (
				<div>
					<ArticleComponent
						title="Data Model Customization"
						text="Administrators can customize the data model in Song to align with most project requirements. This customization is achieved by submitting Song schemas (JSON), which extend the application's base data model. An administrator can submit any number of Song schemas, allowing them to cover various analysis types. Data submission requires an analysis type defined within the metadata payload; this analysis type specifies which Song Schema is used to validate the submission. Song will then use the specified schema to ensure all required fields are present and the content is valid, thereby preserving metadata integrity."
						imageUrl={dataAdmin.src}
					/>
					<ArticleComponent
						title="Data Explorer Configuration"
						text="Accommodating a flexible data model
						must also extend to a flexible representation of the data. The ability to configure
						arrangers' search components gives administrators the ability to customize how search
						facets and data columns are displayed on the data exploration page."
						imageUrl={arrangerConfigs.src}
					/>
					<ArticleComponent
						title="Portal UI Customization"
						text="	With the flexibility to theme and extend the
							Stage UI, administrators can tailor the portal's content for various use cases. This
							includes adding custom pages and menu options that provide valuable information or
							resources, enhancing the portal's overall utility and appeal."
						imageUrl={stageUI.src}
					/>
					<ArticleComponent
						title="Application & User Management"
						text="User and application management
							through Ego oer KeyCloak ensures that only authorized users and applications can
							access the platform. By applying role-based permissions, administrators can precisely
							control what each user or application can do within the system."
						imageUrl={ego.src}
					/>
				</div>
			)}
		</main>
	);
};

export default Content;
