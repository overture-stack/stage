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

import { DropdownButton } from '@/components/Button';
import SchemaTables from '@/components/DataTableComponent/Table';
import { getSchemaBaseColumns } from '@/components/DataTableComponent/tableInit';
import Dropdown from '@/components/DropDown/Dropdown';
import PageLayout from '@/components/PageLayout';
import FileDownload from '@/components/theme/icons/file_download';
import ListFilter from '@/components/theme/icons/list_filter';
import VersionSwitcher from '@/components/VersionSwitcher';
import { css, useTheme } from '@emotion/react';
import { Dictionary } from '@overture-stack/lectern-client';
import { get } from 'lodash';
import { ComponentType, useState } from 'react';
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
	gap: 12px;
	align-items: center;
`;

const titleStyle = (theme: any) => css`
	padding: 10px 16px;
	font-weight: 400;
	font-size: 16px;
	line-height: 1.2;
	color: ${theme.colors.accent_dark};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const DataDictionaryPage: ComponentType<DictionaryPageProps> = ({ data, isLoading, hasError }) => {
	const [dictionaryIndex, setDictionaryIndex] = useState<number>(0);
	const theme = useTheme();

	const name = get(data?.[dictionaryIndex], 'name', hasError ? 'Error loading dictionary' : '') as string;
	const description = get(
		data?.[dictionaryIndex],
		'description',
		hasError ? 'Error loading description' : '',
	) as string;
	return (
		<>
			<PageLayout subtitle="Data Dictionary">
				{isLoading ? <Skeleton width={300} /> : <DictionaryHeader description={description} name={name} />}
				<div css={containerStyle}>
					<div css={buttonsContainerStyle}>
						<VersionSwitcher
							dictionaryIndex={dictionaryIndex}
							dictionaryData={data}
							onVersionChange={setDictionaryIndex}
						/>

						<div css={rightButtonsStyle}>
							<Dropdown leftIcon={<ListFilter />} title="Required Filter" />
							<DropdownButton>
								<FileDownload />
								<span css={titleStyle(theme)}>Submission Templates</span>
							</DropdownButton>
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
