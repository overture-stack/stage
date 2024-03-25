import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';
import ImageBox from '@/components/ImageBox';
import overtureOverview from './assets/overview.png';
import retrievalOverview from './assets/dataretrieval.png';
import submissionOverview from './assets/submission.png';
import StyledLink, { StyledLinkAsButton, InternalLink as Link } from '../../Link';
import { SCORE_DOCS, SUBMISSION_DOCS } from '@/global/utils/constants';

import defaultTheme from '../../theme';
import TerminalComponent from './Terminal';
import Terminal from './Terminal';

const dockerRunCommand = `docker run -d -it \\
--name score-client \\
-e CLIENT_ACCESS_TOKEN="API-Key" \\
-e STORAGE_URL=http://<INSERT-URL> \\
-e METADATA_URL=http://<INSERT-URL> \\
--network="host" \\
--mount type=bind,source="$(pwd)",target=/output \\
ghcr.io/overture-stack/score:latest`;

const dockerDownloadCommand = `docker exec score-client sh -c \\
"score-client download \\
--manifest ./<manifestDirectory>/manifest.txt \\ 
--output-dir ./<outputDirectory>"`;

const InfoPanel = (): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<main
			css={css`
				width: 100vw;
				align-items: center;
				display: flex;
				flex-direction: column;
				background-color: ${theme.colors.white};
				padding-bottom: ${theme.dimensions.footer.height}px;
			`}
		>
			<article
				css={css`
					box-sizing: border-box;
					border-radius: 5px;
					display: flex;
					flex-direction: column;
					margin: 0px 15px 0px 15px;
					padding: 60px;
					width: 98%;
					background-color: ${theme.colors.white};
				`}
			>
				<h1
					css={css`
						color: ${theme.colors.accent};
						font-size: 26px;
						font-weight: normal;
					`}
				>
					Q: How are Overture data platforms used?
				</h1>
				<p
					css={css`
						line-height: 2;
						font-size: 16px;
						font-weight: 200;
					`}
				>
					Overture core functionalities are split between three categories of users:
				</p>
				<ul
					css={css`
						line-height: 2;
						font-size: 16px;
						font-weight: 200;
					`}
				>
					<li>
						Data consumers{' '}
						<strong>
							<em>retrieving data from the platform</em>
						</strong>
					</li>
					<li>
						Data providers,{' '}
						<strong>
							<em>submitting data to the platform</em>
						</strong>
					</li>
					<li>
						Data administrators,{' '}
						<strong>
							<em>managing and configuring the platform</em>
						</strong>
					</li>
				</ul>
				{/* Retrieving Data */}
				<div
					css={css`
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						margin-top: 20px;
						@media (max-width: 1400px) {
							flex-direction: column;
						}
					`}
				>
					<div
						css={css`
							flex: 1;
							margin-right: 20px;
						`}
					>
						<h2
							css={css`
								color: ${theme.colors.black};
								font-size: 22px;
								font-weight: 400;
							`}
						>
							Retrieving data from the platform
						</h2>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
							`}
						>
							<strong>Data Filtering: </strong>Use the search facets in the left-hand panel to
							refine your search, employing checkboxes, data ranges, sliders, and quick search input
							boxes for precise filtering. All your filtering parameters are visible at the top
							query bar, ensuring you have a clear overview of your search criteria. The filtered
							data subset is then displayed within a sortable data table, facilitating efficient
							navigation through potentially massive and complex datasets.
						</p>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
							`}
						>
							<strong>Sharing Queries: </strong>To share your queries, simply copy the browser URL,
							which dynamically updates with your filter parameters.
						</p>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
							`}
						>
							<strong>Downloading Data: </strong>Once you have identified your relevant data, select
							the download dropdown, which provides options for downloading metadata or a file
							manifest in a TSV format. The manifest file is used to download your files of interest
							directly from the resources database and object storage using Overure’s CLI tools,
							specifically the Song and Score clients. We use CLI tools as massive genomic datasets
							require reliable multi-part download sessions unsuitable for a browser.
						</p>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
								margin-bottom: 0px;
							`}
						>
							For more information on using Score including installing the client and downloading
							data with a manifest, see our
							<Link path={SCORE_DOCS}>
								<StyledLink
									css={css`
										line-height: 2;
										font-size: 16px;
										font-weight: 200;
									`}
								>
									{' '}
									Score User Docs.
								</StyledLink>
							</Link>
						</p>
					</div>
					<div
						css={css`
							flex: 1;
						`}
					>
						<img
							css={css`
								max-width: 100%;
								height: auto;
							`}
							src={retrievalOverview.src}
							alt="Retrieving Data Overview"
						/>
					</div>
				</div>
				{/* 
				<h3
					css={css`
						color: ${theme.colors.accent};
						font-size: 16px;
						font-weight: 200;
						margin-left: 60px;
						margin-bottom: 0px;
					`}
				>
					Setting up the Score CLI tool
				</h3>
				<p
					css={css`
						line-height: 2;
						font-size: 16px;
						font-weight: 200;
						margin-left: 60px;
						margin-bottom: 0px;
					`}
				>
					We utilize Docker for all our software services, facilitating rapid installation without
					the need to consider operating system compatibility. To install and run the Score client
					you will need the following information:
				</p>
				<ul
					css={css`
						line-height: 1.5;
						font-size: 16px;
						font-weight: 200;
						margin-left: 60px;
					`}
				>
					<li>An API Key</li>
					<li>The Score Storage URL</li>
					<li>The Song Metadata URL</li>
				</ul>
				<div
					css={css`
						margin-left: 60px;
					`}
				>
					<Terminal command={dockerRunCommand} />
				</div>
				<h3
					css={css`
						color: ${theme.colors.accent};
						font-size: 16px;
						font-weight: 200;
						margin-left: 60px;
						margin-bottom: 0px;
					`}
				>
					Downloading file data using the Score CLI
				</h3>
				<p
					css={css`
						line-height: 2;
						font-size: 16px;
						font-weight: 200;
						margin-left: 60px;
						margin-bottom: 0px;
					`}
				>
					Run the following command to download data using a local manifest:
				</p>
				<div
					css={css`
						margin-left: 60px;
					`}
				>
					<Terminal command={dockerDownloadCommand} />
				</div>
	*/}

				{/* Submitting Data */}
				<div
					css={css`
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						margin-top: 20px;
						@media (max-width: 1400px) {
							flex-direction: column;
						}
					`}
				>
					<div
						css={css`
							flex: 1;
							margin-right: 20px;
							@media (max-width: 1400px) {
								margin-right: 0;
								margin-bottom: 20px;
							}
						`}
					>
						<h2
							css={css`
								color: ${theme.colors.black};
								font-size: 22px;
								font-weight: 400;
							`}
						>
							Submitting data to the platform
						</h2>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
							`}
						>
							<strong>Preparation of Analysis: </strong> An analysis in Overture consists of one or
							more files along with metadata describing these files. Data submitters organize their
							metadata using a spreadsheet editor alongside a data dictionary provided by the
							resource administrator. The data dictionary outlines the required metadata fields and
							their syntax.
						</p>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
							`}
						>
							<strong>Uploading Metadata: </strong> The completed analysis file is uploaded as a
							JSON document using the Song CLI tool. A single command is used to validate the
							metadata payload against the resource's data model, if validation fails, error
							messages detailing the issues are provided. Upon successful validation, confirmation
							is given along with an auto-generated analysis ID.
						</p>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
							`}
						>
							<strong>Generating and Uploading File Manifest: </strong> A file manifest is generated
							using the Song client, specifying the directory containing the files and the analysis
							ID provided on successful submission of your analysis file. This process ensures that
							all metadata can be tracked, using Song's analysis ID, to the corresponding file data
							stored in the cloud. The files are uploaded to object storage using the generated and
							verified manifest with the Score CLI upload command.
						</p>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
							`}
						>
							<strong>Publication Controls: </strong> Publication controls allow administrators and
							data providers to coordinate and prepare data releases in a predictable and timely
							manner. Analyses are, by default, in an unpublished state and can be published or
							suppressed depending on your desired data availability of the data.
						</p>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
								margin-bottom: 0px;
							`}
						>
							For more information on using Song and Score including installing the clients and
							uploading analyses, see our
							<Link path={SUBMISSION_DOCS}>
								<StyledLink
									css={css`
										line-height: 2;
										font-size: 16px;
										font-weight: 200;
									`}
								>
									{' '}
									Song User Docs.
								</StyledLink>
							</Link>
						</p>
					</div>
					<div
						css={css`
							flex: 1;
							@media (max-width: 1400px) {
								margin-left: 0;
							}
						`}
					>
						<img
							css={css`
								max-width: 100%;
								height: auto;
							`}
							src={submissionOverview.src}
							alt="Submitting Data Overview"
						/>
					</div>
				</div>

				{/* Managing and Configuring the platform */}
				<div
					css={css`
						display: flex;
						flex-direction: column;
						margin-top: 20px;
						@media (max-width: 1400px) {
							flex-direction: column;
						}
					`}
				>
					<h2
						css={css`
							color: ${theme.colors.black};
							font-size: 22px;
							font-weight: 400;
						`}
					>
						Managing and configuring the platform
					</h2>
					<div
						css={css`
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							margin-top: 20px;
							@media (max-width: 1400px) {
								flex-direction: column;
							}
						`}
					>
						<div
							css={css`
								flex: 1;
								margin-right: 20px;
							`}
						>
							<p
								css={css`
									line-height: 2;
									font-size: 16px;
									font-weight: 200;
								`}
							>
								<strong>Data Model Customization: </strong> Administrators have the freedom to
								tailor the data model to their specific needs, ensuring that the data structure
								aligns with their project's requirements. By defining their own data model,
								administrators can ensure that all data submitted to the system adheres to a
								consistent structure.
							</p>
							<p
								css={css`
									line-height: 2;
									font-size: 16px;
									font-weight: 200;
								`}
							>
								<strong>Data Portal Customization: </strong> Accommodating a flexible data model
								must also extend to a flexible representation of the data from the portal search
								interface. The ability to customize arrangers' search components gives
								administrators the ability to customize what search facets and data columns, making
								it easier for data consumers to navigate and interact with the resource.
							</p>
							<p
								css={css`
									line-height: 2;
									font-size: 16px;
									font-weight: 200;
								`}
							>
								<strong>Portal Customization:</strong> With the flexibility to theme and extend the
								Stage UI, administrators can tailor the portal's content for various use cases. This
								includes adding custom pages and menu options that provide valuable information or
								resources, enhancing the portal's overall utility and appeal.
							</p>
							<p
								css={css`
									line-height: 2;
									font-size: 16px;
									font-weight: 200;
								`}
							>
								<strong>Managing Users and Applications: </strong> The ability to manage user
								permissions through Ego or KeyCloak ensures that only authorized users can access
								the data and applications. This is crucial for maintaining the security and
								confidentiality of potentially sensitive genomics data. By applying role-based
								permissions, administrators can precisely control what each user or application can
								do within the system. This granular control allows for a more secure and efficient
								data management process, ensuring that users only have access to the data and
								functionalities they need.
							</p>
						</div>
						<div
							css={css`
								flex: 1;
							`}
						>
							<img
								css={css`
									max-width: 100%;
									height: auto;
								`}
								src={overtureOverview.src}
							/>
						</div>
					</div>
				</div>
			</article>
			<article
				css={css`
					box-sizing: border-box;
					border-radius: 5px;
					display: flex;
					flex-direction: column;
					margin: 0px 15px 0px 15px;
					padding: 60px;
					width: 98%;
					background-color: ${theme.colors.white};
				`}
			>
				<h1
					css={css`
						color: ${theme.colors.accent};
						font-size: 26px;
						font-weight: normal;
						margin-bottom: 20px;
					`}
				>
					Q: How are Overture data platforms built?
				</h1>
				<div
					css={css`
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						margin-top: 20px;
						@media (max-width: 1400px) {
							flex-direction: column;
						}
					`}
				>
					<div
						css={css`
							flex: 1;
							margin-right: 20px;
							@media (max-width: 1400px) {
								margin-right: 0;
								margin-bottom: 20px;
							}
						`}
					>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
							`}
						>
							This portal is built using six core microservices, each playing a crucial role in its
							functionality. These microservices include Stage, Arrangers, Keycloak or Ego, Song,
							Score, and Maestro.
						</p>
						<ul
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
							`}
						>
							{/* List items */}

							<li>
								<strong>Stage:</strong> Serves as the basic front-end portal user interface. It
								includes navigation, login, profile, and exploration pages, providing users with a
								seamless experience.
							</li>
							<li>
								<strong>Arranger Components:</strong> A library of search UI components that
								integrates with Stage to offer a configurable search facet panel, data table, and
								filter summary panel. This integration enhances the user's ability to explore and
								query the data effectively.
							</li>
							<li>
								<strong>Arranger Server:</strong> Uses this index to produce a GraphQL search API
								that connects with its front-end library components on the data exploration page.
								This API enables users to perform complex queries and retrieve data in a structured
								and efficient manner.
							</li>
							<li>
								<strong>Song and Score:</strong> Responsible for data management, retrieval, and
								submission. Score is tasked with transferring large genomic files from object
								storage, while Song handles the organization of metadata stored within its database.
								This separation of concerns allows for efficient data handling and retrieval.
							</li>
							<li>
								<strong>Maestro:</strong> Indexes data from a distributed network of Song metadata
								repositories into a unified Elasticsearch index. This centralized indexing
								facilitates faster and more efficient data searches.
							</li>
							<li>
								<strong>Autherization & Authentication:</strong> Integrate with Keycloak or Ego,
								which provide security and enable accessibility with authentication and
								authorization for users and applications. This ensures that only authorized users
								can access the system and its data.
							</li>
						</ul>
					</div>
					<div
						css={css`
							flex: 1;
							@media (max-width: 1400px) {
								margin-left: 0;
							}
						`}
					>
						<img
							css={css`
								max-width: 100%;
								height: auto;
							`}
							src={overtureOverview.src}
							alt="Overture Overview"
						/>
					</div>
				</div>
			</article>
			<article
				css={css`
					box-sizing: border-box;
					border-radius: 5px;
					display: flex;
					flex-direction: column;
					margin: 0px 15px 0px 15px;
					padding: 60px;
					width: 98%;
					background-color: ${theme.colors.white};
				`}
			>
				<h1
					id="how-to-use-it"
					css={css`
						color: ${theme.colors.accent};
						font-size: 26px;
						font-weight: normal;
						margin-bottom: 20px;
					`}
				>
					Q: Why use a microservice architecture?
				</h1>
				<p
					css={css`
						line-height: 2;
						font-size: 16px;
						font-weight: 200;
						margin-left: 20px;
						@media (max-width: 1400px) {
							margin-left: 0;
						}
					`}
				>
					Choosing a microservice framework for Overture was a strategic decision that offers
					several key advantages. <strong> Scalability</strong> is enhanced by allowing individual
					system components to scale independently, ensuring efficient resource allocation.
					<strong> Flexibility</strong> is achieved through the ability to deploy and update each
					microservice separately, simplifying the development process and facilitating the
					introduction of new features or modifications.
					<strong> Resilience</strong> is maintained through fault isolation, ensuring that a single
					point of failure doesn't disrupt the entire system.
				</p>
			</article>
		</main>
	);
};

export default InfoPanel;
