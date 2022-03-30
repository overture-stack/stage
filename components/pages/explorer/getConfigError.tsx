/*
 *
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
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

import { ReactNode } from 'react';
import { css, useTheme } from '@emotion/react';

import { getConfig } from '../../../global/config';

import { GenericHelpMessage } from '../../DMSAdminContact';
import StyledLink from '../../Link';
import { Checkmark, Warning } from '../../theme/icons';

const ArrangerAdminUILink = () => {
  const { NEXT_PUBLIC_ARRANGER_ADMIN_UI } = getConfig();
  return (
    <StyledLink href={NEXT_PUBLIC_ARRANGER_ADMIN_UI} target="_blank">
      Arranger Admin UI
    </StyledLink>
  );
};

const ListItem = ({
  Icon,
  value,
  fieldName,
}: {
  Icon?: ReactNode;
  value: string;
  fieldName: string;
}) => {
  const theme = useTheme();

  return (
    <li
      css={css`
        display: flex;
        align-items: center;
        ${value === 'Missing' &&
        css`
          color: ${theme.colors.error_dark};
        `}
      `}
    >
      {Icon || <Checkmark height={16} width={16} fill={theme.colors.primary} />}
      <span
        css={css`
          padding-left: 6px;
        `}
      >
        {fieldName}:{' '}
        <span
          css={css`
            font-weight: bold;
          `}
        >
          {value}
        </span>
      </span>
    </li>
  );
};

const WarningListItem = ({ fieldName }: { fieldName: string }) => (
  <ListItem Icon={<Warning height={16} width={16} />} fieldName={fieldName} value={'Missing'} />
);

const getConfigError = ({
  hasConfig,
  graphqlField,
  index,
}: {
  hasConfig: boolean;
  graphqlField: string;
  index: string;
}) =>
  index && graphqlField ? (
    !hasConfig && (
      <span>
        No active configurations for the DMS portal exist. Please make sure the index and GraphQL
        field specified in the DMS{' '}
        <span
          css={css`
            font-weight: bold;
          `}
        >
          config.yaml
        </span>{' '}
        file during installation have been created in the <ArrangerAdminUILink />.{' '}
        <GenericHelpMessage />
      </span>
    )
  ) : (
    <span>
      One or more of the following values required by the DMS portal do not exist. Please make sure
      the values are specified in the DMS{' '}
      <span
        css={css`
          font-weight: bold;
        `}
      >
        config.yaml
      </span>{' '}
      file during installation and have been used to create your project in the{' '}
      <ArrangerAdminUILink />. <GenericHelpMessage />
      <ul
        css={css`
          list-style-type: none;
          padding-left: 0px;
        `}
      >
        {[
          { field: 'Alias name', value: graphqlField },
          { field: 'Elasticsearch index', value: index },
        ].map(({ field, value }) => {
          return value ? (
            <ListItem key={`${field}-${value}`} fieldName={field} value={value} />
          ) : (
            <WarningListItem key={`${field}-${value}`} fieldName={field} />
          );
        })}
      </ul>
    </span>
  );

export default getConfigError;
