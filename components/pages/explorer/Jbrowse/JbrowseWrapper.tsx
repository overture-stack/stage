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
import { css, useTheme } from '@emotion/react';
import urlJoin from 'url-join';
import { find } from 'lodash';
import { useTableContext } from '@overture-stack/arranger-components';
import { JbrowseLinear } from '@overture-stack/dms-jbrowse';
import SQON from '@overture-stack/sqon-builder';
import { getConfig } from '@/global/config';
import { SCORE_API_DOWNLOAD_PATH } from '@/global/utils/constants';
import createArrangerFetcher from '@/components/utils/arrangerFetcher';
import { Spinner } from '@/components/theme/icons';
import ErrorNotification from '@/components/ErrorNotification';
import {
  JbrowseQueryNode,
  JbrowseCompatibleFile,
  JbrowseInput,
  ScoreDownloadResult,
  ScoreDownloadParams,
} from './types';
import { checkJbrowseCompatibility } from './utils';
import JbrowseSelectedFilesTable from './JbrowseSelectedFilesTable';

const { NEXT_PUBLIC_SCORE_API_URL } = getConfig();
const arrangerFetcher = createArrangerFetcher({});

// request data for jbrowse display and
// score /download request to get signed URLs
const jbrowseInputQuery = `
query jbrowseInput($filters:JSON){
  file {
    hits (filters: $filters){
      total 
      edges {
        node {
          file_access
          file_type
          object_id
          file {
            name
            size
            index_file {
              object_id
              size
            }
          }
        }
      }
    }
  }
}
`;

const baseScoreDownloadParams = {
  external: 'true',
  offset: '0',
  'User-Agent': 'unknown',
};

const getScoreDownloadUrls = (type: 'file' | 'index', files: JbrowseCompatibleFile[]) =>
  Promise.all(
    files.map((file: JbrowseCompatibleFile) => {
      const length = file[`${type}Size`].toString();
      const object_id = file[`${type}Id`];

      const scoreDownloadParams: ScoreDownloadParams = {
        ...baseScoreDownloadParams,
        length,
        object_id,
      };
      const urlParams = new URLSearchParams(scoreDownloadParams).toString();

      return fetch(
        urlJoin(NEXT_PUBLIC_SCORE_API_URL, SCORE_API_DOWNLOAD_PATH, object_id, `?${urlParams}`),
        {
          headers: { accept: '*/*' },
          method: 'GET',
        },
      ).then((response) => response.json());
    }),
  );

const getUrlFromResult = (results: ScoreDownloadResult[], targetId: string) =>
  find(results, { objectId: targetId })?.parts[0].url || '';

const JbrowseWrapper = () => {
  const theme = useTheme();
  const { selectedRows } = useTableContext({
    callerName: 'Jbrowse Wrapper',
  });
  const [jbrowseEnabled, setJbrowseEnabled] = useState<boolean>(true);
  const [jbrowseCompatibleFiles, setJbrowseCompatibleFiles] = useState<JbrowseCompatibleFile[]>([]);
  const [jbrowseInput, setJbrowseInput] = useState<JbrowseInput[]>([]);
  const [jbrowseLoading, setJbrowseLoading] = useState<boolean>(true);
  const [jbrowseError, setJbrowseError] = useState<string>('');

  const handleError = (error: Error) => {
    setJbrowseEnabled(false);
    setJbrowseError('Something went wrong.');
    console.error(error);
  };

  useEffect(() => {
    // check if any files in selectedRows are compatible with jbrowse.

    setJbrowseLoading(true);

    // fetch metadata from arranger for selected files
    arrangerFetcher({
      endpoint: 'graphql/JBrowseDataQuery',
      body: JSON.stringify({
        variables: {
          filters: SQON.in('object_id', selectedRows),
        },
        query: jbrowseInputQuery,
      }),
    })
      .then(({ data }) => {
        // create a list of files that are compatible with jbrowse
        const nextJbrowseCompatibleFiles = data.file?.hits?.edges
          ?.filter(
            ({
              node: {
                file_access,
                file_type,
                file: { index_file },
              },
            }: {
              node: JbrowseQueryNode;
            }) => checkJbrowseCompatibility({ file_access, file_type, index_file }),
          )
          .map(
            ({ node }: { node: JbrowseQueryNode }): JbrowseCompatibleFile => ({
              fileId: node.object_id,
              fileName: node.file.name,
              fileSize: node.file.size,
              fileType: node.file_type,
              // files without an index were filtered out above this map.
              // falsey handling is for typescript only.
              indexId: node.file.index_file?.object_id || '',
              indexSize: node.file.index_file?.size || 0,
            }),
          );
        setJbrowseCompatibleFiles(nextJbrowseCompatibleFiles);
      })
      .catch((error: Error) => handleError(error));
  }, [selectedRows]);

  useEffect(() => {
    // get score signed URLs for compatible files & indices
    const getFileURLs = getScoreDownloadUrls('file', jbrowseCompatibleFiles);
    const getIndexURLs = getScoreDownloadUrls('index', jbrowseCompatibleFiles);

    Promise.all([getFileURLs, getIndexURLs])
      .then(([fileResults, indexResults]: ScoreDownloadResult[][]) =>
        setJbrowseInput(
          jbrowseCompatibleFiles.map(({ fileId, fileName, fileType, indexId }) => ({
            fileId,
            fileName,
            fileType,
            fileURI: getUrlFromResult(fileResults, fileId),
            indexURI: getUrlFromResult(indexResults, indexId),
          })),
        ),
      )
      .catch((error: Error) => handleError(error))
      .finally(() => setJbrowseLoading(false));
  }, [jbrowseCompatibleFiles]);

  return (
    <div
      css={css`
        margin-top: 8px;
        .MuiPaper-elevation12 {
          // elevation in MUI controls drop shadow
          box-shadow: none;
        }
      `}
    >
      {jbrowseLoading ? (
        <Spinner />
      ) : jbrowseError ? (
        <ErrorNotification size="md">{jbrowseError}</ErrorNotification>
      ) : (
        jbrowseEnabled && (
          <>
            <JbrowseLinear
              configuration={{
                theme: {
                  elevation: 0,
                  palette: { secondary: { main: theme.colors.accent } },
                },
              }}
              selectedFiles={jbrowseInput}
            />
            <JbrowseSelectedFilesTable />
          </>
        )
      )}
    </div>
  );
};

export default JbrowseWrapper;
