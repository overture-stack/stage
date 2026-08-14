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

/** One entry under a `GET /introspection` response's `catalogs` map. */
export type ArrangerIntrospectionCatalog = {
	description?: string;
	documentType?: string;
	status?: string;
};

/** Shape of an Arranger `GET /introspection` response, limited to what catalogue resolution needs. */
export type ArrangerIntrospectionResponse = {
	catalogs?: Record<string, ArrangerIntrospectionCatalog>;
};

/** Outcome of picking which catalogue(s) Stage should use from an introspection response. */
export type ArrangerCatalogueResolution =
	| { status: 'resolved'; catalogueId: string }
	| { status: 'none' }
	| { status: 'ambiguous'; catalogueIds: string[] };

/**
 * Picks the catalogue Stage should use from a `GET /introspection` response, rather than a
 * fixed ID: Stage is data-model agnostic and must work against whatever catalogue a deployment
 * registers, under whatever ID that deployment gives it.
 *
 * `allowedCatalogueIdentifiers`, when non-empty, restricts consideration to catalogues whose ID or
 * `documentType` matches one of the given values (either can identify a catalogue, same as
 * Arranger's own `GET /introspection/:catalogueId` path segment); omitted or empty, every
 * available catalogue is considered, the fully automatic case. Resolves when exactly one
 * catalogue (after that restriction, if any) is available; `'ambiguous'` when more than one is,
 * left to the caller to offer a choice between (see `useArrangerCatalogues`, which wraps this
 * for both the navbar and the explorer page).
 */
export const resolveArrangerCatalogue = (
	introspection: ArrangerIntrospectionResponse | undefined,
	allowedCatalogueIdentifiers: string[] = [],
): ArrangerCatalogueResolution => {
	const availableCatalogues = Object.entries(introspection?.catalogs ?? {}).filter(
		([, catalog]) => catalog.status === 'available',
	);

	const matchingCatalogues = allowedCatalogueIdentifiers.length
		? availableCatalogues.filter(
				([catalogueId, catalog]) =>
					allowedCatalogueIdentifiers.includes(catalogueId) ||
					(catalog.documentType && allowedCatalogueIdentifiers.includes(catalog.documentType)),
			)
		: availableCatalogues;

	const matchingCatalogueIds = matchingCatalogues.map(([catalogueId]) => catalogueId);

	if (matchingCatalogueIds.length === 1) {
		return { status: 'resolved', catalogueId: matchingCatalogueIds[0] };
	}

	return matchingCatalogueIds.length === 0
		? { status: 'none' }
		: { status: 'ambiguous', catalogueIds: matchingCatalogueIds };
};
