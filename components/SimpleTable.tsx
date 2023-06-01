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

import styled from '@emotion/styled';
import { ReactElement } from 'react';
import defaultTheme from './theme';
import { css } from '@emotion/react';

export type TableColumn = { name: string; key: string };
export type TableRecord = Record<string, string | number>;

// this table is for displaying simple data without
// setting up a TableContextProvider

const TableStyled = styled('table')`
  ${({ theme }: { theme: typeof defaultTheme }) => css`
    ${theme.typography.data};
  `}
`;

const ThStyled = styled('th')`
  ${({ theme }: { theme: typeof defaultTheme }) => css`
    font-weight: bold;
    color: ${theme.colors.accent_dark};
    text-align: left;
    border-left: 1px solid ${theme.colors.grey_3};
    padding: 0 8px;
  `};
`;

const TdStyled = styled('td')`
  ${({ theme }: { theme: typeof defaultTheme }) => css`
    position: relative;
    padding: 2px 8px;
    &:before {
      position: absolute;
      display: block;
      content: ' ';
      top: 2px;
      bottom: 2px;
      left: 0;
      border-left: 1px solid ${theme.colors.grey_3};
    }
  `};
`;

const TrStyled = styled('tr')`
  padding: 2px 0;
`;

const SimpleTable = ({
  tableColumns,
  tableData,
}: {
  tableColumns: TableColumn[];
  tableData: TableRecord[];
}): ReactElement => {
  return tableColumns.length && tableData.length ? (
    <TableStyled>
      <thead>
        <TrStyled>
          {tableColumns.map((column) => (
            <ThStyled key={column.key}>{column.name}</ThStyled>
          ))}
        </TrStyled>
      </thead>
      <tbody>
        {tableData.map((row: TableRecord) => (
          <TrStyled key={row.file_id}>
            {Object.entries(row).map(([key, value]) => {
              return <TdStyled key={key}>{value}</TdStyled>;
            })}
          </TrStyled>
        ))}
      </tbody>
    </TableStyled>
  ) : (
    <></>
  );
};

export default SimpleTable;
