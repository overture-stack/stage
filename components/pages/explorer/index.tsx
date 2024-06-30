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

import { useEffect, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import { ArrangerDataProvider } from '@overture-stack/arranger-components';

import ErrorNotification from '../../ErrorNotification';
import Loader from '../../Loader';
import PageLayout from '../../PageLayout';
import createArrangerFetcher from '../../utils/arrangerFetcher';
import sleep from '../../utils/sleep';
import { getConfig } from '../../../global/config';
import { RepoFiltersType } from './sqonTypes';

import getConfigError from './getConfigError';
import PageContent from './PageContent';

export interface PageContentProps {
	sqon: RepoFiltersType;
	selectedTableRows: string[];
	setSelectedTableRows: (ids: []) => void;
	index: string;
	api: ({
		endpoint,
		body,
		headers,
		method,
	}: {
		endpoint: string;
		body: string;
		headers: any;
		method: string;
	}) => Promise<any>;
	setSQON: (sqon: RepoFiltersType) => void;
	fetchData?: () => Promise<any>;
}

const arrangerFetcher = createArrangerFetcher({});

const configsQuery = `
  query ($documentType: String!, $index: String!) {
    hasValidConfig (documentType: $documentType, index: $index)
  }
`;

const RepositoryPage = () => {
	const theme = useTheme();
	const {
		NEXT_PUBLIC_ARRANGER_API,
		NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE,
		NEXT_PUBLIC_ARRANGER_INDEX,
	} = getConfig();
	const [arrangerHasConfig, setArrangerHasConfig] = useState<boolean>(false);
	const [loadingArrangerConfig, setLoadingArrangerConfig] = useState<boolean>(true);

	useEffect(() => {
		arrangerFetcher({
			endpoint: 'graphql/hasValidConfig',
			body: JSON.stringify({
				variables: {
					documentType: NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE,
					index: NEXT_PUBLIC_ARRANGER_INDEX,
				},
				query: configsQuery,
			}),
		})
			.then(async ({ data } = {}) => {
				if (data?.hasValidConfig) {
					await setArrangerHasConfig(data.hasValidConfig);
					// 1s delay so loader doesn't flicker on and off too quickly
					await sleep(1000);

					return setLoadingArrangerConfig(false);
				}

				throw new Error('Could not validate Arranger server configuration!');
			})
			.catch(async (err) => {
				console.warn(err);
				// same as above comment
				await sleep(1000);
				setLoadingArrangerConfig(false);
			});
	}, [NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE, NEXT_PUBLIC_ARRANGER_INDEX]);

	const ConfigError = getConfigError({
		hasConfig: arrangerHasConfig,
		index: NEXT_PUBLIC_ARRANGER_INDEX,
		documentType: NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE,
	});

	return (
		<PageLayout subtitle="Data Explorer">
			{loadingArrangerConfig ? (
				<div
					css={(theme) =>
						css`
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							background-color: ${theme.colors.grey_2};
						`
					}
				>
					<Loader />
				</div>
			) : ConfigError ? (
				<ErrorNotification
					title={'Configuration Error'}
					size="lg"
					css={css`
						flex-direction: column;
						justify-content: center;
						align-items: center;
					`}
				>
					{ConfigError}
				</ErrorNotification>
			) : (
				<ArrangerDataProvider
					apiUrl={NEXT_PUBLIC_ARRANGER_API}
					customFetcher={arrangerFetcher}
					documentType={NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE}
					theme={{
						colors: {
							common: {
								black: theme.colors.black,
							},
						},
					}}
				>
					<PageContent />
				</ArrangerDataProvider>
			)}
		</PageLayout>
	);
};

export default RepositoryPage;
