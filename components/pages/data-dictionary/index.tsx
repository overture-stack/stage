/*
 *
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
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

import { css } from '@emotion/react';
import PageLayout from '@/components/PageLayout';
import Dropdown from '@/components/DropDown/DropDown';

const DataDictionaryPage = () => {
	const versionMap = new Map<string, string>([
		['Version 1.28 (2025-02-07)', '/v1.28'],
		['Version 1.27 (2025-02-06)', '/v1.27'],
		['Version 1.26 (2025-02-05)', '/v1.26'],
		['Version 1.25 (2025-02-04)', '/v1.25'],
		['Version 1.24 (2025-02-03)', '/v1.24'],
	]);
	return (
		<PageLayout subtitle="Data Dictionary">
			<div
				css={(theme) => css`
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100%;
					background-color: ${theme.colors.white};
					border-radius: 8px;
					padding: 20px;
				`}
			>
				Welcome to the Data Dictionary page!
				<Dropdown title="Version 1.10 (yy-mm-dd)" MenuItemMap={versionMap} />
			</div>
		</PageLayout>
	);
};

export default DataDictionaryPage;
