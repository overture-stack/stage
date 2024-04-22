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

import { SUBMISSION_DOCS } from '@/global/utils/constants';

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
						text="Our six core microservices, Ego, Song, Score, Maestro, Arranger and Stage, combine to build end-to-end data platforms. Here is how our services are being used to build out this demo portal:"
						imageUrl={overtureOverview.src}
					>
						<p>
							<b>Ego</b>, is our identity and permission management service, broadly enabling
							authorization and authentication of all user users and applications. Overture can also
							integrate with third-party Oauth service, Keycloak. <b>Song and Score</b> manage data
							submission, management, and retrieval, automating file-to-metadata tracking and
							validating data submissions against a customizable model. These services enhance data
							quality, findability, and interoperability. <b>Maestro</b> indexes submitted metadata
							from the Song repository into an Elasticsearch index. <b>Arranger</b> references this
							index to produce a GraphQL search API, connected to our configurable search UI
							components on the data exploration page. <b>Stage</b> integrates these services into
							the React-based front-data portal UI you're currently viewing.
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
								<b>1. Create a data subset:</b> From the exploration page, use the search facets in
								the left-hand panel to refine your search. All your filtering parameters are visible
								at the top query bar, ensuring you have a clear overview of your search criteria. To
								share your queries, you can simply copy the browser URL, which dynamically updates
								as you filter through the dataset.
							</p>

							<p>
								<b>2. Generate a manifest:</b> Select the download dropdown, and click file
								manifest. The downloaded file manifest will be used next to download the data with
								our Score Client CLI tool. We use CLI tools as massive genomic datasets require
								reliable multi-part download sessions unsuitable for a browser.
							</p>

							<p>
								<b>3. Run the Score-client:</b> With Docker installed, the Score client is run using
								the following command:
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
								<b>4. Download your data:</b> You can download the data outlined in your manifest
								file by running the following command:
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
								<b>Note on authentication:</b> Typically you will require authorization from an
								administrator prior to accessing any given resource. Upon approval, researchers can
								access the portal by selecting the login button at the top of the screen. Since this
								demo portal is an open-access resource, no login information is required.
							</p>
						</div>
					</ArticleComponent>

					<ArticleComponent
						title="Data Submission"
						text="Public users do not have the required permissions to submit data to this demo portal. To enable full access, we are currently developing an easy-to-install quickstart. To get updates, join our Slack channel linked within the footer. The following information provides a high-level overview of the data submission process."
						imageUrl={submissionOverview.src}
					>
						<p>
							{' '}
							The initial step in data submission involves <b>preparing an analysis file.</b> In
							Overture, an analysis consists of one or more files along with metadata. Data
							submitters typically use a spreadsheet editor, complemented by a data dictionary
							provided by the resource administrator, to organize their metadata. This dictionary
							outlines the required metadata fields and their syntax. Following this,{' '}
							<b>the analysis file is uploaded</b> as a JSON document via the Song CLI tool. A
							single command validates the metadata against the resource's data model. Upon
							successful validation, the payload is committed to the database, and the user receives
							an auto-generated analysis ID. Subsequently, the user <b>generates a file manifest</b>{' '}
							using the Song client's manifest command, which necessitates specifying the directory
							of the files and a valid analysis ID. This process enables Song to link all metadata
							within its database to the corresponding file data stored in the cloud. Finally,{' '}
							<b>the files are uploaded to object storage</b> using the verified manifest with the
							Score CLI upload command. Additional publication controls allow administrators and
							data providers to manage data releases predictably and timely. Analyses are
							unpublished by default and can be published or suppressed using the Song Client.{' '}
						</p>
						<p>
							For detailed information on data submission with Song and Score, including installing
							the clients and uploading data, see our{' '}
							<a href={SUBMISSION_DOCS} target="_blank" rel="noopener noreferrer">
								{' '}
								submission documentation here
							</a>
							.
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
							through Ego or KeyCloak ensures that only authorized users and applications can
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
