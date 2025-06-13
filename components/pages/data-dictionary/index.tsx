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
import FilterDropdown from '@/components/FilterDropdown';
import PageLayout from '@/components/PageLayout';
import { css } from '@emotion/react';
import { Dictionary } from '@overture-stack/lectern-client';
import { get } from 'lodash';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DictionaryHeader from './DictionaryHeader';
import { DictionaryPageProps } from './types';

export type FilterMapping = {
	constraints?: FilterOptions[];
	active: boolean;
};
export type FilterOptions = 'Required' | 'All Fields';

const DataDictionaryPage = ({ data, isLoading, hasError }: DictionaryPageProps) => {
	const name = get(data, 'name', hasError ? 'Error loading dictionary' : '') as string;
	const description = get(data, 'description', hasError ? 'Error loading description' : '') as string;
	const [filters, setFilters] = useState<FilterMapping>({ active: false, constraints: [] });
	const displayData = () => {
		// If the filter is not active or we just have nothing to filter, return the original data
		if (!filters.active || !filters.constraints?.length) {
			return data;
		}
		return {
			...data,
			schemas: data?.schemas.map((schema) => ({
				...schema,
				fields: schema.fields.filter((field: any) => {
					// we are going to filter via the constraints that are given
					if (filters.constraints?.includes('Required')) {
						return !field?.restrictions?.required === true;
					}
					if (filters.constraints?.includes('All Fields')) {
						return true; // If All Fields is selected, we include all fields
					}
				}),
			})),
		};
	};

	return (
		<PageLayout subtitle="Data Dictionary">
			{isLoading ? <Skeleton width={300} /> : <DictionaryHeader description={description} name={name} />}

			<div
				css={css`
					max-width: 1200px;
					width: 100%;
					margin: 0 auto;
					padding: 0 20px;
					margin-top: 30px;
				`}
			>
				{data && <FilterDropdown filters={filters} setFilters={setFilters} />}

				{displayData && (
					<SchemaTables<Dictionary>
						data={displayData() as Dictionary}
						arrayAccessor="schemas"
						getColumns={getSchemaBaseColumns as any}
					/>
				)}
			</div>
		</PageLayout>
	);
};

export default DataDictionaryPage;
