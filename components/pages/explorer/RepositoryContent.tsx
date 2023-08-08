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

import { css, useTheme } from '@emotion/react';
import {
  Table,
  TableContextProvider,
  useArrangerTheme,
  useTableContext,
} from '@overture-stack/arranger-components';
import { CustomExporterInput } from '@overture-stack/arranger-components/dist/Table/DownloadButton/types';
import { UseThemeContextProps } from '@overture-stack/arranger-components/dist/ThemeContext/types';
import urlJoin from 'url-join';

import { getConfig } from '@/global/config';
import StyledLink from '@/components/Link';
import { DMSThemeInterface } from '@/components/theme';
import { Download, Spinner } from '@/components/theme/icons';
import ActionBar from './ActionBar';
import Tabs from './Tabs';
import { TabsContextProvider, useTabsContext } from './TabsContext';
import TablePagination from './TablePagination';
import JbrowseWrapper from './Jbrowse/JbrowseWrapper';

export enum RepositoryTabNames {
  FILES = 'Files',
  JBROWSE = 'JBrowse',
}

const getTableConfigs = ({
  apiHost,
  customExporters,
  theme,
}: {
  apiHost: string;
  customExporters?: CustomExporterInput;
  theme: DMSThemeInterface;
}): UseThemeContextProps => ({
  callerName: 'RepositoryContent',
  components: {
    Table: {
      // functionality
      hideLoader: true,

      // appearance
      background: theme.colors.white,
      borderColor: theme.colors.grey_3,
      css: css`
        ${theme.shadow.default}
      `,

      // Child components
      CountDisplay: {
        fontColor: 'inherit',
      },
      DownloadButton: {
        customExporters,
        downloadUrl: urlJoin(apiHost, 'download'),
        background: theme.colors.accent,
        fontColor: theme.colors.white,
        borderColor: theme.colors.accent,
        hoverBackground: theme.colors.accent_dark,
        fontWeight: 'bold',
        padding: '2px 10px',
        borderRadius: '5px',
        fontSize: '14px',
        css: css`
          ${theme.typography.baseFont}
          border-width: 1px;
          line-height: 24px;
        `,
        label: () => (
          <>
            <Download
              fill={theme.colors.white}
              style={css`
                margin-right: 0.2rem;

                [disabled] & > path {
                  fill: ${theme.colors.grey_5};
                }
              `}
            />{' '}
            Download
          </>
        ),
        ListWrapper: {
          width: '11rem',
        },
      },
      DropDown: {
        arrowColor: theme.colors.white,
        arrowTransition: 'all 0s',
        background: theme.colors.accent,
        borderColor: theme.colors.accent,
        css: css`
          ${theme.typography.subheading2}
          border-width: 1px;
          line-height: 24px;
        `,
        fontColor: theme.colors.white,
        disabledFontColor: theme.colors.grey_5,
        hoverBackground: theme.colors.accent_dark,
        fontSize: '14px',
        padding: '2px 10px',
        ListWrapper: {
          background: theme.colors.white,
          css: css`
            ${theme.shadow.default}
          `,
          fontColor: theme.colors.black,
          fontSize: '0.7rem',
          hoverBackground: theme.colors.grey_2,
        },
      },
      HeaderRow: {
        borderColor: theme.colors.grey_3,
        css: css`
          ${theme.typography.data}
        `,
        fontColor: theme.colors.accent_dark,
        fontSize: '13px',
        fontWeight: 'bold',
        lineHeight: '1.7rem',
      },
      MaxRowsSelector: {
        fontColor: 'inherit',
      },
      Row: {
        css: css`
          &:nth-of-type(2n-1):not(.selected) {
            background-color: ${theme.colors.grey_1};
          }
        `,
        hoverBackground: theme.colors.grey_highlight,
        lineHeight: '1.5rem',
        selectedBackground: theme.colors.secondary_light,
        verticalBorderColor: theme.colors.grey_3,
      },
      TableWrapper: {
        margin: '0.5rem 0',
      },
    },
  },
});

const ContentDisplay = () => {
  const { activeTab } = useTabsContext();
  const { isLoading } = useTableContext({
    callerName: 'Repository - Content Display',
  });

  switch (activeTab) {
    case RepositoryTabNames.FILES:
      return isLoading ? (
        <Spinner />
      ) : (
        <>
          <Table />
          <TablePagination />
        </>
      );
    case RepositoryTabNames.JBROWSE:
      return <JbrowseWrapper />;
    default:
      return null;
  }
};

const RepositoryContent = () => {
  const { NEXT_PUBLIC_ARRANGER_API, NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS } = getConfig();
  const theme = useTheme();

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const manifestColumns = NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS.split(',')
    .filter((field: string) => field.trim()) // break it into arrays, and ensure there's no empty field names
    .map((fieldName: string) => fieldName.replace(/['"]+/g, '').trim());
  const customExporters = [
    { label: 'File Table', fileName: `data-explorer-table-export.${today}.tsv` }, // exports a TSV with what is displayed on the table (columns selected, etc.)
    { label: 'File Manifest', fileName: `score-manifest.${today}.tsv`, columns: manifestColumns }, // exports a TSV with the manifest columns
    {
      label: () => (
        <span
          css={css`
            border-top: 1px solid ${theme.colors.grey_3};
            margin-top: -3px;
            padding-top: 7px;
            white-space: pre-line;

            a {
              margin-left: 3px;
            }
          `}
        >
          To download files using a file manifest, please follow these
          <StyledLink
            css={css`
              line-height: inherit;
            `}
            href="https://overture.bio/documentation/score/user-guide/download"
            rel="noopener noreferrer"
            target="_blank"
          >
            instructions
          </StyledLink>
          .
        </span>
      ),
    },
  ];

  useArrangerTheme(getTableConfigs({ apiHost: NEXT_PUBLIC_ARRANGER_API, customExporters, theme }));

  return (
    <article
      css={css`
        background-color: ${theme.colors.white};
        border-radius: 5px;
        margin-bottom: 12px;
        padding: 8px;
        ${theme.shadow.default};
      `}
    >
      <TableContextProvider>
        <TabsContextProvider defaultTabs={[{ name: 'Files', canClose: false }]}>
          <ActionBar />
          <Tabs />
          <ContentDisplay />
        </TabsContextProvider>
      </TableContextProvider>
    </article>
  );
};

export default RepositoryContent;