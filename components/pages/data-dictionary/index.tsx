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
import PageLayout from '@/components/PageLayout';
import { css } from '@emotion/react';
import { Dictionary } from '@overture-stack/lectern-client';
import { get } from 'lodash';
import { ComponentType } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DictionaryHeader from './DictionaryHeader';
import { DictionaryPageProps } from './types';

const DataDictionaryPage: ComponentType<DictionaryPageProps> = ({ data, isLoading, hasError }) => {
	const name = get(data, 'name', hasError ? 'Error loading dictionary' : '') as string;
	const description = get(data, 'description', hasError ? 'Error loading description' : '') as string;
	return (
		<>
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
					{data && (
						<SchemaTables<Dictionary> data={data} arrayAccessor="schemas" getColumns={getSchemaBaseColumns as any} />
					)}
				</div>
			</PageLayout>
		</>
	);
};

export default DataDictionaryPage;
