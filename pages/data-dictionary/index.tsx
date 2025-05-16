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
import { useEffect, useState } from 'react';

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
				const data = await res.json();

				setHeaderData({
					...headerData,
					name: data?.dictionary?.name || headerData.name,
				});
			} catch (err) {
				console.error('Error loading dictionary header:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchDictionaryData();
	}, []);

	if (loading) {
		return (
			<div>
				<p>loading</p>
			</div>
		);
	}

	return <DataDictionaryPage DictionaryHeaderProp={headerData} />;
});

export default DataDictionary;
