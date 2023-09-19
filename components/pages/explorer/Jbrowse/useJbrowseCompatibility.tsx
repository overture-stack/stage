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

import createArrangerFetcher from '@/components/utils/arrangerFetcher';
import { useTableContext } from '@overture-stack/arranger-components';
import SQON from '@overture-stack/sqon-builder';
import { useEffect, useState } from 'react';
import { JbrowseQueryNode } from './types';
import { checkJbrowseCompatibility, jbrowseErrors, MAX_JBROWSE_FILES } from './utils';

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
  const [jbrowseCircularEnabled, setJbrowseCircularEnabled] = useState<boolean>(false);
  const [jbrowseLinearEnabled, setJbrowseLinearEnabled] = useState<boolean>(false);
  const [jbrowseEnabled, setJbrowseEnabled] = useState<boolean>(false);
  const [jbrowseLoading, setJbrowseLoading] = useState<boolean>(false);
  const [jbrowseCircularError, setJbrowseCircularError] = useState<string>('');
  const [jbrowseLinearError, setJbrowseLinearError] = useState<string>('');

  const resolveJbrowse = ({
    linearError = '',
    circularError = '',
  }: {
    linearError?: string;
    circularError?: string;
  }) => {
    setJbrowseLinearError(linearError);
    setJbrowseCircularError(circularError);
    setJbrowseLoading(false);
    setJbrowseLinearEnabled(!linearError);
    setJbrowseCircularEnabled(!circularError);
  };

  useEffect(() => {
    // check if conditions are met to launch jbrowse
    setJbrowseLoading(true);
    setJbrowseCircularEnabled(false);
    setJbrowseLinearEnabled(false);

    // check if # of selectedRows is in acceptable range
    const selectedRowsCount = selectedRows.length;
    const selectedRowsError: string =
      selectedRowsCount === 0
        ? jbrowseErrors('jbrowseLinear').selectedFilesUnderLimit
        : selectedRowsCount > MAX_JBROWSE_FILES
        ? jbrowseErrors('jbrowseLinear').selectedFilesOverLimit
        : '';

    if (selectedRowsError) {
      resolveJbrowse({ linearError: selectedRowsError });
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
            }) =>
              checkJbrowseCompatibility({
                file_access,
                file_type,
                index_file,
                jbrowseType: 'jbrowseLinear',
              }),
          );
          compatibleFilesError =
            jbrowseCompatibleFiles.length === 0
              ? jbrowseErrors('jbrowseLinear').compatibleFilesUnderLimit
              : '';
        })
        .catch(async (err: Error) => {
          compatibleFilesError = jbrowseErrors('jbrowseLinear').default;
          console.error(err);
        })
        .finally(() => {
          resolveJbrowse({ linearError: compatibleFilesError });
        });
    }
  }, [selectedRows]);

  return {
    jbrowseCircularEnabled,
    jbrowseCircularError,
    jbrowseLinearEnabled,
    jbrowseLinearError,
    jbrowseLoading,
  };
};

export default useJbrowseCompatibility;
