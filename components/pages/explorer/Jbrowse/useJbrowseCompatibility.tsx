/*
 *
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
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
import SQON from '@overture-stack/sqon-builder';
import { useTableContext } from '@overture-stack/arranger-components';
import createArrangerFetcher from '@/components/utils/arrangerFetcher';
import { MAX_JBROWSE_FILES, checkJbrowseCompatibility, jbrowseErrors } from './utils';
import { JbrowseQueryNode } from './types';

const arrangerFetcher = createArrangerFetcher({});

const jbrowseCompatibilityQuery = `
  query tableData($filters: JSON) {
  file {
    hits(filters: $filters) {
      edges {
        node {
          file_access
          file_type
          file {
            index_file {
              file_type
            }
          }
        }
      }
    }
  }
}
`;

const useJbrowseCompatibility = () => {
	const { selectedRows } = useTableContext({
		callerName: 'Jbrowse - Compatibility Check',
	});
	const [jbrowseEnabled, setJbrowseEnabled] = useState<boolean>(false);
	const [jbrowseLoading, setJbrowseLoading] = useState<boolean>(false);
	const [jbrowseErrorText, setJbrowseErrorText] = useState<string>('');

	const resolveJbrowse = (error: string) => {
		setJbrowseErrorText(error);
		setJbrowseLoading(false);
		setJbrowseEnabled(!error);
	};

	useEffect(() => {
		// check if conditions are met to launch jbrowse
		setJbrowseLoading(true);
		setJbrowseEnabled(false);

		// check if # of selectedRows is in acceptable range
		const selectedRowsCount = selectedRows.length;
		const selectedRowsError: string =
			selectedRowsCount === 0
				? jbrowseErrors.selectedFilesUnderLimit
				: selectedRowsCount > MAX_JBROWSE_FILES
				? jbrowseErrors.selectedFilesOverLimit
				: '';

		if (selectedRowsError) {
			resolveJbrowse(selectedRowsError);
		} else {
			// check if # of compatible files is in acceptable range
			let compatibleFilesError = '';
			arrangerFetcher({
				endpoint: 'graphql/JbrowseCompatibilityQuery',
				body: JSON.stringify({
					variables: {
						filters: SQON.in('object_id', selectedRows),
					},
					query: jbrowseCompatibilityQuery,
				}),
			})
				.then(async ({ data }) => {
					const jbrowseCompatibleFiles = (data.file?.hits?.edges || []).filter(
						({
							node: {
								file_access,
								file_type,
								file: { index_file },
							},
						}: {
							node: JbrowseQueryNode;
						}) => checkJbrowseCompatibility({ file_access, file_type, index_file }),
					);
					const jbrowseCompatibleFilesCount = jbrowseCompatibleFiles.length;
					compatibleFilesError =
						jbrowseCompatibleFilesCount === 0 ? jbrowseErrors.compatibleFilesUnderLimit : '';
				})
				.catch(async (err: Error) => {
					compatibleFilesError = jbrowseErrors.default;
					console.error(err);
				})
				.finally(() => {
					resolveJbrowse(compatibleFilesError);
				});
		}
	}, [selectedRows]);

	return {
		jbrowseEnabled,
		jbrowseErrorText,
		jbrowseLoading,
	};
};

export default useJbrowseCompatibility;
