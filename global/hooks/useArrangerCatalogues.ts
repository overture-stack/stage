/*
 *
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
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
import urlJoin from 'url-join';

import ajax from '@/components/utils/ajax';
import {
	ArrangerIntrospectionResponse,
	resolveArrangerCatalogue,
} from '@/components/utils/resolveArrangerCatalogue';
import { getConfig } from '@/global/config';
import { INTERNAL_API_PROXY } from '@/global/utils/constants';

/** One catalogue Stage can offer, with enough detail to label it in a menu. */
export type ArrangerCatalogueOption = {
	catalogueId: string;
	description?: string;
	documentType?: string;
};

export type UseArrangerCataloguesResult = {
	catalogues: ArrangerCatalogueOption[];
	hasError: boolean;
	isLoading: boolean;
};

/**
 * Fetches Arranger's `GET /introspection` and resolves which catalogue(s) Stage should offer,
 * respecting `NEXT_PUBLIC_ARRANGER_CATALOGUES` if set. Shared between the navbar (to decide
 * between a plain link and a dropdown) and the explorer page (to decide what to query), so both
 * agree on the same catalogue set; each mounts its own fetch rather than sharing one, a second
 * cheap `GET /introspection` per page load, not worth a shared context for.
 */
export const useArrangerCatalogues = (): UseArrangerCataloguesResult => {
	const { NEXT_PUBLIC_ARRANGER_CATALOGUES } = getConfig();
	const [catalogues, setCatalogues] = useState<ArrangerCatalogueOption[]>([]);
	const [hasError, setHasError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const allowedCatalogueIdentifiers = NEXT_PUBLIC_ARRANGER_CATALOGUES.split(',')
			.map((value) => value.trim())
			.filter((value) => value);

		ajax
			.get(urlJoin(INTERNAL_API_PROXY.ARRANGER, 'introspection'))
			.then((response) => {
				const introspection: ArrangerIntrospectionResponse = response.data;
				const resolution = resolveArrangerCatalogue(introspection, allowedCatalogueIdentifiers);
				const matchingCatalogueIds =
					resolution.status === 'resolved'
						? [resolution.catalogueId]
						: resolution.status === 'ambiguous'
							? resolution.catalogueIds
							: [];

				setCatalogues(
					matchingCatalogueIds.map((catalogueId) => ({
						catalogueId,
						description: introspection?.catalogs?.[catalogueId]?.description,
						documentType: introspection?.catalogs?.[catalogueId]?.documentType,
					})),
				);
				setHasError(resolution.status === 'none');
			})
			.catch((err) => {
				console.warn(err);
				setHasError(true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [NEXT_PUBLIC_ARRANGER_CATALOGUES]);

	return { catalogues, hasError, isLoading };
};

export default useArrangerCatalogues;
