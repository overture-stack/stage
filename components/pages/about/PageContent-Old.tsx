import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import overtureOverview from './assets/overview-comp.png';
import retrievalOverview from './assets/dataretrieval.png';
import submissionOverview from './assets/submission.png';
import StyledLink, { InternalLink as Link } from '../../Link';
import { SCORE_DOCS, SUBMISSION_DOCS } from '@/global/utils/constants';

import SwaggerEndpoint from './SwaggerEndpoint';

import defaultTheme from '../../theme';

const Content = ({ activeId }: { activeId: string | null }): ReactElement => {
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
				<article
					css={css`
						box-sizing: border-box;
						border-radius: 5px;
						padding: 0px 300px 0px 60px;
					`}
				>
					<div>
						<h1
							css={css`
						color: ${theme.colors.accent};
						font-size: 26px;s
						font-weight: normal;
					`}
						>
							Q: What is Overture?
						</h1>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
								text-align: justify;
							`}
						>
							Overture is a collection of flexible, open-source software microservices that improve
							and simplify the process of building and deploying online platforms for researchers to
							gather, organize, and share genomics data.
						</p>
					</div>
					<div>
						<h1
							css={css`
								color: ${theme.colors.accent};
								font-size: 26px;
								font-weight: normal;
							`}
						>
							Q: Who is Overture for?
						</h1>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
								text-align: justify;
							`}
						>
							We designed and developed the Overture suite to simplify the development and
							deployment of large-scale data platforms. These data platforms enable research groups
							to efficiently organize and share genomics data globally, helping researchers maximize
							the potential of existing data by ensuring its transparency, reproducibility, and
							reuse all while retaining oversight over its distribution.
						</p>
					</div>
					<div>
						<h1
							css={css`
						color: ${theme.colors.accent};
						font-size: 26px;s
						font-weight: normal;
					`}
						>
							Q: Who uses Overture?
						</h1>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
								text-align: justify;
							`}
						>
							Overture core functionalities are split between three categories of users:
							<ul>
								1. Data consumers,{' '}
								<strong>
									<em>retrieving data from the platform</em>
								</strong>
							</ul>
							<ul>
								2. Data providers,{' '}
								<strong>
									<em>submitting data to the platform</em>
								</strong>
							</ul>
							<ul>
								3. Data administrators,{' '}
								<strong>
									<em>managing and configuring the platform</em>
								</strong>
							</ul>
						</p>
					</div>
					<div>
						<h1
							css={css`
								color: ${theme.colors.accent};
								font-size: 26px;
								font-weight: normal;
							`}
						>
							Q: Why use a microservice architecture?
						</h1>
						<p
							css={css`
								line-height: 2;
								font-size: 16px;
								font-weight: 200;
								text-align: justify;
							`}
						>
							Choosing a microservice framework for Overture was a strategic decision that provides
							several key advantages:
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
						</p>
					</div>
				</article>
			)}
			{/* How its built */}
			{activeId === 'software' && (
				<article
					css={css`
						box-sizing: border-box;
						border-radius: 5px;
						padding: 0px 60px 0px 60px;
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
						Q: How are Overture data platforms built?
					</h1>
					<div
						css={css`
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							@media (max-width: 1200px) {
								flex-direction: column;
								justify-content: left;
								align-items: left;
							}
						`}
					>
						<div>
							<img
								css={css`
									padding: 30px;
									max-width: 600px;
									height: auto;
									@media (max-width: 1200px) {
										max-width: 80%;
									}
								`}
								src={overtureOverview.src}
								alt="Overture Overview"
							/>
						</div>

						<div
							css={css`
								padding: 30px 60px 0px 0px;
								flex: 1;
							`}
						>
							<div
								css={css`
									line-height: 2;
									font-size: 16px;
									font-weight: 200;
									text-align: justify;
								`}
							>
								<p
									css={css`
										line-height: 2;
										font-size: 16px;
										font-weight: 200;
										text-align: justify;
									`}
								>
									This demo portal was built using six core Overture microservices including Stage,
									Arrangers, Keycloak or Ego, Song, Score, and Maestro.
									<ul>
										{/* List items */}
										<li>
											<strong>Stage:</strong> is the customizable front-ends user interface
											including prebuilt components (ex. Navbar and Footer), theming, and login,
											profile, and exploration pages
										</li>
										<li>
											<strong>Arranger Components:</strong> are our library of search UI components
											made to integrate with Stages data expolorer page. Components include a
											configurable search facet panel, data table, and filter summary panel.
										</li>
										<li>
											<strong>Arranger Server:</strong> Uses this index to produce a GraphQL search
											API that connects with its front-end library components on the data
											exploration page. This API enables users to perform complex queries and
											retrieve data in a structured and efficient manner.
										</li>
										<li>
											<strong>Song and Score:</strong> Responsible for data management, retrieval,
											and submission. Score is tasked with transferring large genomic files from
											object storage, while Song handles the organization of metadata stored within
											its database. This separation of concerns allows for efficient data handling
											and retrieval.
										</li>
										<li>
											<strong>Maestro:</strong> Indexes data from a distributed network of Song
											metadata repositories into a unified Elasticsearch index. This centralized
											indexing facilitates faster and more efficient data searches.
										</li>
										<li>
											<strong>Autherization & Authentication:</strong> Overture can integrate with
											Keycloak or Ego, which provide security and enable accessibility with
											authentication and authorization for users and applications. This ensures that
											only authorized users can access the system and its data.
										</li>
									</ul>
								</p>
							</div>
						</div>
					</div>
				</article>
			)}

			{/* Retrieving Data */}
			{activeId === 'retrieval' && (
				<article
					css={css`
						box-sizing: border-box;
						border-radius: 5px;
						padding: 0px 60px 0px 60px;
						background-color: ${theme.colors.white};
					`}
				>
					<h1
						css={css`
							color: ${theme.colors.accent};
							padding-left: 30px;
							font-size: 26px;
							font-weight: normal;
						`}
					>
						Q: How do I retrive data from the platform?
					</h1>
					<div
						css={css`
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							@media (max-width: 1800px) {
								flex-direction: column;
								justify-content: left;
								align-items: left;
							}
						`}
					>
						<div>
							<img
								css={css`
									padding: 30px;
									max-width: 1000px;
									height: auto;
									@media (max-width: 1800px) {
										max-width: 80%;
									}
								`}
								src={retrievalOverview.src}
								alt="Retrieving Data Overview"
							/>
						</div>
						<div
							css={css`
								padding: 30px 60px 0px 0px;
								flex: 1;
							`}
						>
							<div
								css={css`
									line-height: 2;
									font-size: 16px;
									font-weight: 200;
									text-align: justify;
								`}
							>
								<p>
									<strong>Data Filtering: </strong>Use the search facets in the left-hand panel to
									refine your search, employing checkboxes, data ranges, sliders, and quick search
									input boxes for precise filtering. All your filtering parameters are visible at
									the top query bar, ensuring you have a clear overview of your search criteria. The
									filtered data subset is then displayed within a sortable data table, facilitating
									efficient navigation through potentially massive and complex datasets.
								</p>
								<p>
									<strong>Sharing Queries: </strong>To share your queries, simply copy the browser
									URL, which dynamically updates with your filter parameters.
								</p>
								<p>
									<strong>Downloading Data: </strong>Once you have identified your relevant data,
									select the download dropdown, which provides options for downloading metadata or a
									file manifest in a TSV format. The manifest file is used to download your files of
									interest directly from the resources database and object storage using Overure’s
									CLI tools, specifically the Song and Score clients. We use CLI tools as massive
									genomic datasets require reliable multi-part download sessions unsuitable for a
									browser.
								</p>
								<p>
									For more information on using Score including installing the client and
									downloading data with a manifest, see our
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
						</div>
					</div>
				</article>
			)}

			{/* Submitting Data */}

			{activeId === 'submission' && (
				<article
					css={css`
						box-sizing: border-box;
						border-radius: 5px;
						padding: 0px 60px 0px 60px;
						background-color: ${theme.colors.white};
					`}
				>
					<h1
						css={css`
							color: ${theme.colors.accent};
							padding-left: 30px;
							font-size: 26px;
							font-weight: normal;
						`}
					>
						Q: How do I submit data to the platform?
					</h1>
					<div
						css={css`
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							@media (max-width: 1800px) {
								flex-direction: column;
								justify-content: left;
								align-items: left;
							}
						`}
					>
						<div>
							<img
								css={css`
									padding: 30px;
									max-width: 1000px;
									height: auto;
									@media (max-width: 1800px) {
										max-width: 80%;
									}
								`}
								src={submissionOverview.src}
								alt="Submitting Data Overview"
							/>
						</div>
						<div
							css={css`
								padding: 30px 60px 0px 0px;
								flex: 1;
							`}
						>
							<div
								css={css`
									line-height: 2;
									font-size: 16px;
									font-weight: 200;
									text-align: justify;
								`}
							>
								<p>
									<strong>Preparation of Analysis: </strong> An analysis in Overture consists of one
									or more files along with metadata describing these files. Data submitters organize
									their metadata using a spreadsheet editor alongside a data dictionary provided by
									the resource administrator. The data dictionary outlines the required metadata
									fields and their syntax.
								</p>
								<p>
									<strong>Uploading Metadata: </strong> The completed analysis file is uploaded as a
									JSON document using the Song CLI tool. A single command is used to validate the
									metadata payload against the resource's data model, if validation fails, error
									messages detailing the issues are provided. Upon successful validation,
									confirmation is given along with an auto-generated analysis ID.
								</p>
								<p>
									<strong>Generating and Uploading File Manifest: </strong> A file manifest is
									generated using the Song client, specifying the directory containing the files and
									the analysis ID provided on successful submission of your analysis file. This
									process ensures that all metadata can be tracked, using Song's analysis ID, to the
									corresponding file data stored in the cloud. The files are uploaded to object
									storage using the generated and verified manifest with the Score CLI upload
									command.
								</p>
								<p>
									<strong>Publication Controls: </strong> Publication controls allow administrators
									and data providers to coordinate and prepare data releases in a predictable and
									timely manner. Analyses are, by default, in an unpublished state and can be
									published or suppressed depending on your desired data availability of the data.
								</p>
								<p>
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
						</div>
					</div>
				</article>
			)}

			{/* Administrating Data */}

			{activeId === 'administration' && (
				<article
					css={css`
						box-sizing: border-box;
						border-radius: 5px;
						padding: 0px 60px 0px 60px;
						background-color: ${theme.colors.white};
					`}
				>
					<SwaggerEndpoint endpointPath="/" />
					<h1
						css={css`
							color: ${theme.colors.accent};
							padding-left: 30px;
							font-size: 26px;
							font-weight: normal;
						`}
					>
						Q: How can I configure the platform?
					</h1>
					<div
						css={css`
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							@media (max-width: 1800px) {
								flex-direction: column;
								justify-content: left;
								align-items: left;
							}
						`}
					>
						<div>
							<img
								css={css`
									padding: 30px;
									max-width: 1000px;
									height: auto;
									@media (max-width: 1800px) {
										max-width: 80%;
									}
								`}
								src={submissionOverview.src}
								alt="Submitting Data Overview"
							/>
						</div>
						<div
							css={css`
								padding: 30px 60px 0px 0px;
								flex: 1;
							`}
						>
							<div
								css={css`
									line-height: 2;
									font-size: 16px;
									font-weight: 200;
									text-align: justify;
								`}
							>
								<p>
									<strong>Data Model Customization: </strong> Administrators have the freedom to
									tailor the data model to their specific needs, ensuring that the data structure
									aligns with their project's requirements. By defining their own data model,
									administrators can ensure that all data submitted to the system adheres to a
									consistent structure.
								</p>
								<p>
									<strong>Data Portal Customization: </strong> Accommodating a flexible data model
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
								</p>
								<p>
									<strong>Managing Users and Applications: </strong> The ability to manage user
									permissions through Ego or KeyCloak ensures that only authorized users can access
									the data and applications. This is crucial for maintaining the security and
									confidentiality of potentially sensitive genomics data. By applying role-based
									permissions, administrators can precisely control what each user or application
									can do within the system. This granular control allows for a more secure and
									efficient data management process, ensuring that users only have access to the
									data and functionalities they need.
								</p>
							</div>
						</div>
					</div>
				</article>
			)}
		</main>
	);
};

export default Content;
