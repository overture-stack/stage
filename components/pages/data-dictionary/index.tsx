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

import SchemaTables from '@/components/DataTableComponent/Table';
import { getSchemaBaseColumns } from '@/components/DataTableComponent/tableInit';
import DictionaryDownloadButton from '@/components/DictionaryDownloadButton';
import Dropdown from '@/components/Dropdown/Dropdown';
import PageLayout from '@/components/PageLayout';
import ListFilter from '@/components/theme/icons/list_filter';
import VersionSwitcher from '@/components/VersionSwitcher';
import { css } from '@emotion/react';
import { Dictionary } from '@overture-stack/lectern-client';
import { get } from 'lodash';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DictionaryHeader from './DictionaryHeader';
import { DictionaryPageProps } from './types';

const containerStyle = css`
	width: 70%;
	display: flex;
	flex-direction: column;
	align-items: start;
	margin: 0 auto;
`;

const buttonsContainerStyle = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40px;
	flex-wrap: wrap;
	gap: 16px;
	width: 100%;
`;

const rightButtonsStyle = css`
	display: flex;
	justify-content: space-between;
	gap: 20px;
	align-items: center;
`;

const DataDictionaryPage = ({ data, isLoading, hasError }: DictionaryPageProps) => {
	const [dictionaryIndex, setDictionaryIndex] = useState(0);

	const name = get(data?.[dictionaryIndex], 'name', hasError ? 'Error loading dictionary' : '') as string;
	const description = get(
		data?.[dictionaryIndex],
		'description',
		hasError ? 'Error loading description' : '',
	) as string;
	const version = get(data?.[dictionaryIndex], 'version', '') as string;
	console.log(version);
	return (
		<>
			<PageLayout subtitle="Data Dictionary">
				{isLoading ? <Skeleton width={300} /> : <DictionaryHeader description={description} name={name} />}
				<div css={containerStyle}>
					<div css={buttonsContainerStyle}>
						<VersionSwitcher
							dictionaryIndex={dictionaryIndex}
							dictionaryData={data as Dictionary[]}
							onVersionChange={setDictionaryIndex}
						/>

						<div css={rightButtonsStyle}>
							<Dropdown leftIcon={<ListFilter />} title="Required Filter" />
							<DictionaryDownloadButton name={name} version={version} lecternUrl="http://localhost:3031" />
						</div>
					</div>

					{data && (
						<SchemaTables<Dictionary>
							data={data?.[dictionaryIndex]}
							arrayAccessor="schemas"
							getColumns={getSchemaBaseColumns as any}
						/>
					)}
				</div>
			</PageLayout>
		</>
	);
};

export default DataDictionaryPage;
