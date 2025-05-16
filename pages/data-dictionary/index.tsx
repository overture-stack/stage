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

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DataDictionaryPage from '@/components/pages/data-dictionary';
import { createPage } from '@/global/utils/pages';
import { useEffect, useState } from 'react';

const schemaMap = new Map<number, any>();

const DataDictionary = createPage({
	getInitialProps: async () => {
		return {
			dictionaryHeaderData: {
				name: 'Dictionary unsuccessfully loaded',
				description: 'Description is unable to be loaded',
			},
		};
	},
	isPublic: true,
})(({ dictionaryHeaderData }) => {
	const [headerData, setHeaderData] = useState(dictionaryHeaderData);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDictionaryData = async () => {
			try {
				setLoading(true);
				const res = await fetch('/api/lectern/');

				if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

				const data = await res.json();

				data.dictionary.schemas.forEach((schema: any, index: number) => {
					schemaMap.set(index, schema);
				});

				setHeaderData({
					name: data?.dictionary?.name || 'Dictionary',
					description: data?.dictionary?.description || 'No description available',
				});
			} catch (err) {
				console.error('Error loading dictionary header:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchDictionaryData();
	}, []);

	return (
		<DataDictionaryPage
			DictionaryHeaderProp={{
				name: loading ? <Skeleton width={300} height={40} /> : headerData.name,
				description: loading ? <Skeleton count={2} width={500} /> : headerData.description,
			}}
		/>
	);
});

export default DataDictionary;
