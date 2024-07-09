import { useEffect, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import { ArrangerDataProvider } from '@overture-stack/arranger-components';

import ErrorNotification from '../../ErrorNotification';
import EntryNotification from '../../EntryNotification';
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
	const [isModalVisible, setModalVisible] = useState<boolean>(true);

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

	const handleDismiss = () => {
		setModalVisible(false);
	};

	return (
		<PageLayout subtitle="Data Explorer">
			{isModalVisible ? (
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
					<EntryNotification
						css={css`
							flex-direction: column;
							justify-content: center;
							align-items: center;
						`}
						// TODO: use "loading" from Arranger data, so table is ready after dismissing the modal
						loading={loadingArrangerConfig}
						onDismiss={handleDismiss}
						size="lg"
						title={'Welcome to the Overture Platform Demo'}
					>
						<p>Explore the features of our Overture platform through this demo, which includes:</p>
						<ul>
							<li>
								<b>Data Exploration:</b> Navigate our Data Exploration page with mock data.
							</li>
							<li>
								<b>Learn More Guides:</b> Access basic guides to understand how the platform works.
							</li>
						</ul>
					</EntryNotification>
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
