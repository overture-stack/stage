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
import { css } from '@emotion/react';
import { useTableContext } from '@overture-stack/arranger-components';
import SQON from '@overture-stack/sqon-builder';
import SimpleTable, { TableColumn, TableRecord } from '@/components/SimpleTable';
import createArrangerFetcher from '@/components/utils/arrangerFetcher';
import ErrorNotification from '@/components/ErrorNotification';
import ExpandButton from '@/components/ExpandButton';
import { JbrowseSelectedFilesQueryNode } from './types';
import { checkJbrowseCompatibility, jbrowseAllowedFileTypes } from './utils';

const arrangerFetcher = createArrangerFetcher({});

const jbrowseSelectedFilesTableQuery = `
query ($filters:JSON){
  file {
    hits (filters: $filters) {
      edges {
        node {
          id
          file_type
          study_id
          file_access
          data_type
          donors {
            hits {
              edges {
                node {
                  donor_id
                }
              }
            }
          }
          file {
            name
            size
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

const tableColumns: TableColumn[] = [
  { key: 'data_type', name: 'Data Type' },
  { key: 'donor_id', name: 'Donor ID' },
  { key: 'file_access', name: 'File Access' },
  { key: 'file_id', name: 'File ID' },
  { key: 'file_name', name: 'File Name' },
  { key: 'file_size', name: 'File Size' },
  { key: 'file_type', name: 'File Type' },
  { key: 'study_id', name: 'Study ID' },
];

const JbrowseSelectedFilesTable = () => {
  const { selectedRows } = useTableContext({
    callerName: 'Repository - JBrowse Selected Files Table',
  });
  const [tableData, setTableData] = useState<TableRecord[]>([]);
  const [hasWarnings, setHasWarnings] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(true);

  useEffect(() => {
    // check if any files are incompatible with Jbrowse
    // then get table data for compatible/visualized files
    arrangerFetcher({
      endpoint: 'graphql/TableDataQuery',
      body: JSON.stringify({
        variables: {
          filters: SQON.in('object_id', selectedRows),
        },
        query: jbrowseSelectedFilesTableQuery,
      }),
    })
      .then(({ data }) => {
        // get data for table
        const jbrowseCompatibleFiles =
          data.file?.hits?.edges
            ?.filter(
              ({
                node: {
                  file_type,
                  file: { index_file },
                },
              }: {
                node: JbrowseSelectedFilesQueryNode;
              }) => checkJbrowseCompatibility({ file_type, index_file }),
            )
            .map(({ node }: { node: JbrowseSelectedFilesQueryNode }) => ({
              data_type: node.data_type,
              donor_id: node.donors.hits.edges[0].node.donor_id,
              file_access: node.file_access,
              file_id: node.id,
              file_name: node.file.name,
              file_size: node.file.size,
              file_type: node.file_type,
              study_id: node.study_id,
            })) || [];
        setTableData(jbrowseCompatibleFiles);

        // check for errors/incompatibility
        const hasIncompatibleFiles = selectedRows.length > jbrowseCompatibleFiles.length;
        setHasWarnings(hasIncompatibleFiles);
      })
      .catch(async (err) => {
        console.warn(err);
      });
  }, [selectedRows]);

  return (
    <div
      css={css`
        margin-top: 20px;
      `}
    >
      {hasWarnings && (
        <ErrorNotification
          size="md"
          css={css`
            margin: 20px 0 10px;
            max-width: none;
          `}
          onDismiss={() => setHasWarnings(false)}
          dismissible
          level="warning"
        >
          Some files selected are not supported by JBrowse. Supported file types:{' '}
          {jbrowseAllowedFileTypes.join(', ')}. Index files are required.
        </ErrorNotification>
      )}
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          margin-top: 20px;
        `}
      >
        <h3
          css={(theme) => css`
            ${theme.typography.subheading};
            margin: 0;
          `}
        >
          {selectedRows.length} File{selectedRows.length === 1 ? '' : 's'} Selected
        </h3>
        <ExpandButton isOpen={showTable} onClick={() => setShowTable(!showTable)}>
          {showTable ? 'Hide' : 'Show'} Table
        </ExpandButton>
      </div>
      {showTable && <SimpleTable tableColumns={tableColumns} tableData={tableData} />}
    </div>
  );
};

export default JbrowseSelectedFilesTable;
