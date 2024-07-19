/*
 *
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 *  SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 *  OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 *  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import { ReactElement } from 'react';
import { css, useTheme } from '@emotion/react';

import defaultTheme from '../../theme';
import ArticleComponent from './ArticleComponent';

import overtureOverview from './assets/portalOverview.webp';
import retrievalOverview from './assets/dataRetrieval.webp';
import submissionOverview from './assets/dataSubmission.webp';
import dataAdmin from './assets/dataAdministration.webp';
import arrangerConfigs from './assets/arrangerConfigs.webp';
import stageUI from './assets/stageUI.webp';
import ego from './assets/ego.webp';

import NoteBox from './notebox';

const Content = ({ activeId }: { activeId: string }): ReactElement => {
	const theme: typeof defaultTheme = useTheme();

	return (
		<main
			css={css`
				width: 100%;
				background-color: ${theme.colors.white};
				padding-bottom: ${theme.dimensions.footer.height}px;
				display: flex;
				justify-content: center;
				align-items: center;
			`}
		>
			<div
				css={css`
					width: 100%;
					max-width: 1200px;
					padding: 0 48px;
					box-sizing: border-box;
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
							text="Our six core microservices, Ego, Song, Score, Maestro, Arranger and Stage, combine to build end-to-end data platforms. Here is how our services are being used to build out this demo portal:"
							imageUrl={overtureOverview.src}
						>
							<ul>
								<li>
									<b>Ego</b>, is our identity and permission management service, broadly enabling
									authorization and authentication of all user users and applications. Overture can
									also integrate with third-party auth service, Keycloak.
								</li>
								<li>
									<b>Song and Score</b> manage data submission, management, and retrieval,
									automating file-to-metadata tracking and validating data submissions against a
									customizable model. These services enhance data quality, findability, and
									interoperability.
								</li>
								<li>
									<b>Maestro</b> indexes submitted metadata from the Song repository into an
									Elasticsearch index.
								</li>
								<li>
									<b>Arranger</b> references this index to produce a GraphQL search API, connected
									to our configurable search UI components on the data exploration page.
								</li>
								<li>
									<b>Stage</b> integrates these services into the React-based front-data portal UI
									you're currently viewing.
								</li>
							</ul>
							<NoteBox title="Get started using Overture">
								We provide a{' '}
								<a
									href="https://overture.bio/getting-started/"
									target="_blank"
									rel="noopener noreferrer"
								>
									QuickStart
								</a>{' '}
								for fast and frictionless setup of our data platform locally. This QuickStart
								complements our continually updated, and{' '}
								<a
									href="https://overture.bio/documentation/guides/"
									target="_blank"
									rel="noopener noreferrer"
								>
									more comprehensive guides available here
								</a>{' '}
							</NoteBox>
						</ArticleComponent>
					</div>
				)}
				{/* How our platforms are used */}
				{activeId === 'usage' && (
					<div>
						<ArticleComponent
							title="Data Retrieval"
							text="Users filter data via Arrangers' search components in the Stage UI's data explorer. After selecting a subset, you can download a manifest from the download dropdown.  To download Song and Score a valid API key will be needed. Once a user logs in through Stage's auth integration, they can access their API key from the profile page. Data downloads are managed using a seperate Score Client CLI tool. We use CLI tools because massive genomic datasets require reliable multi-part download sessions, which are unsuitable for a browser."
							imageUrl={retrievalOverview.src}
						>
							<NoteBox title="Give it a try">
								This demo portal operates as a read-only environment with a publicly available API
								Key. To download data, refer to our guide on{' '}
								<a
									href="https://overture.bio/documentation/guides/download/clientdownload/"
									target="_blank"
									rel="noopener noreferrer"
								>
									CLI downloads with Score
								</a>{' '}
								, using the following values where required:
								<ul>
									<li>
										<b>Public API Key: </b> <code>87b41e4f-e011-4797-ab54-87242ebc72dd</code>
									</li>

									<li>
										<b>STORAGE_URL: </b> <code>https://score.demo.overture.bio/</code>
									</li>

									<li>
										<b>METADATA_URL: </b> <code>https://song.demo.overture.bio/</code>
									</li>
								</ul>
							</NoteBox>
						</ArticleComponent>

						<ArticleComponent
							title="Data Submission"
							text="Before starting the submission process, data providers need to gather and organize metadata. This involves using a spreadsheet editor alongside the data dictionary provided by the resource administrators. The data dictionary outlines the structure and specifications for the metadata, including field names, requirements and formatting. After preparing the metadata according to these specifications, data providers export their organized metadata into a JSON file. This JSON file is now ready to be uploaded."
							imageUrl={submissionOverview.src}
						>
							<ol>
								<li>
									<b>Upload metadata to Song</b> as a JSON document via the Song CLI tool. A single
									command validates the metadata against the resource's data model. Upon successful
									validation, the metadta is committed to the database, and the user receives an
									auto-generated analysis ID. In Overture, the term analysis is a unit of related
									file data and file metadata.
								</li>
								<li>
									<b>Generate a file manifest:</b> Using the Song Clients manifest command,
									specifying the local directory of your file data and provide a valid analysis ID.
									This process enables Song to link the associated metadata within its database to
									the corresponding file data that will be stored in the cloud following upload.
								</li>
								<li>
									<b>Upload your files:</b> Using the Song Clients upload command, specify the path
									of your manifest and upload.
								</li>
								<li>
									<b>Publish your data:</b> Additional publication controls allow administrators and
									data providers to manage data releases predictably and timely. Analyses are
									unpublished by default and can be published or suppressed using the Song Client.
								</li>
							</ol>
							<NoteBox title="Learn More">
								Our data submission workflow is detailedd extensively within our{' '}
								<a
									href="https://www.overture.bio/documentation/guides/submission/clientsubmission/"
									target="_blank"
									rel="noopener noreferrer"
								>
									CLI data submission guide
								</a>
								.
							</NoteBox>
						</ArticleComponent>
					</div>
				)}
				{/* Data Administration & Portal Configuration */}
				{activeId === 'build' && (
					<div>
						<ArticleComponent
							title="Data Model Customization"
							text="Administrators can tailor the data model in Song to meet the needs of almost any project. This customization process involves providing Song schemas, formatted as JSON, that extend the core data model of Song. There's no limit to how many Song schemas an administrator can submit, enabling comprehensive coverage across different experimental scenarios. To facilitate data submission, data providers must specify an analysis type within the metadata payload. This designated analysis type determines which Song Schema is used to verify the submission. By using the selected schema, Song ensures that all essential fields are included and that the content adheres to the expected standards, thus safeguarding the integrity of the metadata."
							imageUrl={dataAdmin.src}
						>
							<NoteBox title="Learn more">
								For more information on customizing Song's data model, check out our{' '}
								<a
									href="https://overture.bio/documentation/guides/administration/modelling/"
									target="_blank"
									rel="noopener noreferrer"
								>
									Song data modelling guide
								</a>
								.
							</NoteBox>
						</ArticleComponent>
						<ArticleComponent
							title="Data Explorer Configuration"
							text="Accommodating a flexible data model
						must also extend to a flexible representation of the data. The ability to configure
						arrangers' search components gives administrators the ability to customize how search
						facets and data columns are displayed on the data exploration page."
							imageUrl={arrangerConfigs.src}
						>
							<NoteBox title="Learn more">
								If you're interested in learning more see our guide on{' '}
								<a
									href="https://www.overture.bio/documentation/guides/administration/portalcustomization/"
									target="_blank"
									rel="noopener noreferrer"
								>
									customizing your data portal
								</a>
								.
							</NoteBox>
						</ArticleComponent>

						<ArticleComponent
							title="Portal UI Customization"
							text="	With the flexibility to theme and extend the
							Stage UI, administrators can tailor the portal's content for various use cases. This
							includes adding custom pages and menu options that provide valuable information or
							resources, enhancing the portal's overall utility and appeal."
							imageUrl={stageUI.src}
						>
							<NoteBox title="Let us know">
								Basic Stage documentation is{' '}
								<a
									href="https://www.overture.bio/documentation/stage/"
									target="_blank"
									rel="noopener noreferrer"
								>
									available here
								</a>{' '}
								. We're actively working on enhancing our documentation and guides, and we welcome
								any suggestions from the community regarding topics they would find useful. If you
								have a topic suggestion, feel free to reach out through the Slack channel or email
								address listed in the footer, or by{' '}
								<a
									href="https://github.com/overture-stack/website/issues/new?assignees=&labels=&projects=&template=Feature_Requests.md"
									target="_blank"
									rel="noopener noreferrer"
								>
									submitting a feature request via this link
								</a>{' '}
								.
							</NoteBox>
						</ArticleComponent>
						<ArticleComponent
							title="Application & User Management"
							text="User and application management
							through Ego or KeyCloak ensures that only authorized users and applications can
							access the platform. By applying role-based permissions, administrators can precisely
							control what each user or application can do within the system."
							imageUrl={ego.src}
						/>
					</div>
				)}
			</div>
		</main>
	);
};

export default Content;
