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

import { useMemo } from 'react';
import { css, useTheme } from '@emotion/react';
import { ArrangerDataProvider } from '@overture-stack/arranger-components';

import ErrorNotification from '@/components/ErrorNotification';
import Loader from '@/components/Loader';
import PageLayout from '@/components/PageLayout';
import createArrangerFetcher from '@/components/utils/arrangerFetcher';
import useArrangerCatalogues from '@/global/hooks/useArrangerCatalogues';
import useUrlParamState from '@/global/hooks/useUrlParamsState';
import { getConfig } from '@/global/config';
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

const RepositoryPage = () => {
	const theme = useTheme();
	const { NEXT_PUBLIC_ARRANGER_API } = getConfig();
	const [urlCatalogue] = useUrlParamState<string | null>('catalogue', null, {
		serialize: (value) => value ?? '',
		deSerialize: (value) => value || null,
	});
	const { catalogues, hasError, isLoading } = useArrangerCatalogues();

	// A URL-named catalogue wins if it's actually offered (reached via the navbar dropdown, or a
	// shared link); otherwise default to the first one, there's no neutral "pick one" landing
	// state here, selection happens from the navbar, not this page.
	const selectedCatalogue = catalogues.find(({ catalogueId }) => catalogueId === urlCatalogue) ?? catalogues[0];

	const arrangerFetcher = useMemo(
		() => (selectedCatalogue ? createArrangerFetcher({ catalogue: selectedCatalogue.catalogueId }) : undefined),
		[selectedCatalogue],
	);

	const ConfigError = getConfigError({ hasConfig: !hasError });

	return (
		<PageLayout subtitle="Data Explorer">
			{isLoading ? (
				<div
					css={(theme) => css`
						align-items: center;
						background-color: ${theme.colors.grey_2};
						display: flex;
						flex-direction: column;
						justify-content: center;
					`}
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
			) : selectedCatalogue ? (
				<ArrangerDataProvider
					apiUrl={NEXT_PUBLIC_ARRANGER_API}
					catalogue={selectedCatalogue.catalogueId}
					customFetcher={arrangerFetcher}
					documentType={selectedCatalogue.documentType}
					key={selectedCatalogue.catalogueId}
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
			) : null}
		</PageLayout>
	);
};

export default RepositoryPage;
