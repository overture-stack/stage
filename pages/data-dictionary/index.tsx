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

import DataDictionaryPage from '@/components/pages/data-dictionary';
import { createPage } from '@/global/utils/pages';
import * as lectern from '@overture-stack/lectern-client';
import { Dictionary } from '@overture-stack/lectern-client';
import { useEffect, useState } from 'react';

const lecternUrl = 'http://localhost:3031'; //Replace with your actual lectern URL
const dictionaryName = 'example-dictionary'; //Replace with your actual dictionary name

const DataDictionary = createPage({
	getInitialProps: async () => {},
	isPublic: true,
})(() => {
	const [dictionaryVersions, setDictionaryVersions] = useState<lectern.rest.DictionarySummary[] | null>(null);
	const [dictionaryData, setDictionaryData] = useState<Dictionary[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchAllDictionaryData = async () => {
			try {
				setLoading(true);
				const fetchedDictionaryVersions = await lectern.rest.listDictionaries(lecternUrl, {
					name: dictionaryName,
				});
				if (!fetchedDictionaryVersions.success) {
					throw new Error('Failed to fetch dictionary versions');
				}
				setDictionaryVersions(fetchedDictionaryVersions.data);
				// Now that we have versions, we can fetch the associated dictionary data from the versions
				await fetchAllDictionaryDataFromVersions(fetchedDictionaryVersions.data);
			} catch (err) {
				console.error('Error loading dictionary versions:', err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		const fetchAllDictionaryDataFromVersions = async (versions: lectern.rest.DictionarySummary[]) => {
			try {
				setLoading(true);
				const dictionaryFetches = versions.map((DictionaryVersion) =>
					lectern.rest.getDictionary(lecternUrl, {
						name: DictionaryVersion.name,
						version: DictionaryVersion.version,
					}),
				);

				// We need to execute all fetches concurrently and wait for all of them to complete such that we have all the successful results
				//data
				const results = await Promise.all(dictionaryFetches);

				// We need to filter all the successful results and map them to the Dictionary type
				const validDictionaries: Dictionary[] = results
					.filter((res) => res.success)
					.map((res) => res.data as Dictionary);

				setDictionaryData(validDictionaries);
			} catch (err) {
				console.error('Error loading dictionary data:', err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchAllDictionaryData();
	}, []);

	return <DataDictionaryPage data={dictionaryData} isLoading={loading} hasError={error} />;
});

export default DataDictionary;
