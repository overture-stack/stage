/*
 *
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *   If not, see <http://www.gnu.org/licenses/>.
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
import { css } from '@emotion/react';
import defaultTheme from '../../theme';

const styles = {
	container: css`
		background-color: ${defaultTheme.colors.white};
		padding: 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-top: 2rem;
		min-height: 415px;

		@media (max-width: 768px) {
			margin-top: -3rem;
			margin-bottom: 2rem;
			min-height: 325px;
		}
	`,
	title: css`
		font-size: 1.5rem;
		font-weight: 700;
		color: ${defaultTheme.colors.button};
		margin-bottom: 2rem;
	`,
	text: css`
		font-size: 1rem;
		color: ${defaultTheme.colors.black};
		margin-bottom: 1.5rem;
		opacity: 0.8;
	`,
	learnMoreLink: css`
		display: inline-block;
		padding: 1rem 2rem;
		background-color: ${defaultTheme.colors.button};
		color: ${defaultTheme.colors.white};
		text-decoration: none;
		font-weight: 900;
		border-radius: 900px;
		transition: transform 0.3s ease;
		position: relative;
		top: 1rem;

		&:hover {
			transform: translateY(-2px);
		}
	`,
};

const Acknowledgment = (): ReactElement => (
	<div css={styles.container}>
		<h2 css={styles.title}>Acknowledgement</h2>
		<p css={styles.text}>
			The OICR Genome Informatics group built this portal using Overture, an open-source software suite for creating
			data platforms that enable researchers to organize, share, and explore datasets.
		</p>
		<p css={styles.text}>Want to improve your data management?</p>
		<p css={styles.text}>Email contact@overture.bio</p>
		<a href="https://www.overture.bio/" target="_blank" rel="noopener noreferrer" css={styles.learnMoreLink}>
			Learn More
		</a>
	</div>
);

export default Acknowledgment;
