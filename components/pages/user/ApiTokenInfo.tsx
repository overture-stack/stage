import { css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming';
import { has, isEmpty, orderBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tippy';

import { parseExpiry, getDayValue } from '../../../global/utils/apiToken';
import { getConfig } from '../../../global/config';
import useAuthContext from '../../../global/hooks/useAuthContext';
import { EGO_API_KEY_ENDPOINT } from '../../../global/utils/constants';

import Button from '../../Button';
import StyledLink from '../../Link';

import defaultTheme from '../../theme';
import { Checkmark } from '../../theme/icons';
import { AccessLevel, parseScope, ScopeObj } from '../../../global/utils/egoTokenUtils';
import ErrorNotification from '../../ErrorNotification';

import sleep from '../../utils/sleep';
import DMSAdminContact, { GenericHelpMessage } from '../../DMSAdminContact';

interface ApiToken {
  expiryDate: string;
  isRevoked: boolean;
  issueDate: string;
  name: string;
  scope: string[];
}

const TooltipContainer = styled('div')`
  ${({ theme }: { theme: typeof defaultTheme }) => css`
    ${theme.typography.label};
    background: ${theme.colors.grey_6};
    border-radius: 2px;
    padding: 2px 4px;
    color: white;
    font-weight: normal;
    margin-bottom: 10%;
    &:before {
      content: '';
      display: block;
      position: absolute;
      width: 0;
      height: 0;
      border: 5px solid transparent;
      pointer-events: none;
      right: 50%;
      top: 79%;
      border-top-color: ${theme.colors.grey_6};
      border-right: 5px solid transparent;
      border-left: 5px solid transparent;
      margin-right: -5px;
    }
  `}
`;

const ApiTokenInfo = () => {
  const { user, token, fetchWithAuth } = useAuthContext();
  const [existingApiToken, setExistingApiToken] = useState<ApiToken | null>(null);
  const [isCopyingToken, setIsCopyingToken] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | React.ReactNode | null>(null);
  const theme: typeof defaultTheme = useTheme();

  // still need to display any errors for the generate request, as permissions may have changed in between
  // the time a user signed in and when they attempted to generate a token
  const generateApiToken = async () => {
    const { NEXT_PUBLIC_EGO_API_ROOT } = getConfig();
    if (user) {
      const scopesResult = await fetchWithAuth(
        `${NEXT_PUBLIC_EGO_API_ROOT}/o/scopes?userId=${user.id}`,
        { method: 'GET' },
      )
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(
              `HTTP error ${res.status}: Error fetching current permissions. Your API token could not be generated. `,
            );
          }
          return res.json();
        })
        .then((json) => json.scopes)
        .catch((err: Error) => {
          setErrorMessage(err.message);
          console.warn(err);
          return err;
        });

      // prevent api token request if scopes request fails
      if (!Array.isArray(scopesResult)) {
        return;
      }

      const filteredScopes = scopesResult
        .map((s: string) => parseScope(s))
        .filter((s: ScopeObj) => s.accessLevel !== AccessLevel.DENY);

      if (filteredScopes.length) {
        const scopeParams = filteredScopes.map((f: ScopeObj) => `${f.policy}.${f.accessLevel}`);

        const apiKeyUrl = new URL(EGO_API_KEY_ENDPOINT);
        scopeParams.map((param) =>
          apiKeyUrl.searchParams.append('scopes', encodeURIComponent(param)),
        );
        apiKeyUrl.searchParams.append('user_id', user.id);

        return fetchWithAuth(apiKeyUrl.href, { method: 'POST' })
          .then((res) => {
            if (res.status !== 200) {
              throw new Error(`HTTP error ${res.status}: Your API token could not be generated. `);
            }
            return res.json();
          })
          .then((newApiToken: ApiToken) => {
            setExistingApiToken(newApiToken);
            setErrorMessage(null);
          })
          .catch((err: Error) => {
            setErrorMessage(err.message);
            return err;
          });
      } else {
        const messageSpan = (
          <span>
            You do not have permissions to generate an API token. Your permissions may have changed
            recently. Please contact the <DMSAdminContact /> to gain the correct permissions.
          </span>
        );
        // request for apiToken is skipped if filteredScopes is empty
        setErrorMessage(messageSpan);
      }
    }
  };

  const revokeApiToken = async () => {
    return (
      existingApiToken &&
      fetchWithAuth(`${EGO_API_KEY_ENDPOINT}?apiKey=${existingApiToken.name}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(`HTTP error ${res.status}: Your API token could not be revoked. `);
          }
          setExistingApiToken(null);
          setErrorMessage(null);
        })
        .catch((err: Error) => {
          setErrorMessage(err.message);
          console.warn(err);
        })
    );
  };

  const copyApiToken = (text: string) => {
    setIsCopyingToken(true);
    navigator.clipboard
      .writeText(text)
      .then(async () => {
        await setIsCopyingToken(false);
        await setCopySuccess(true);
        await sleep();
        setCopySuccess(false);
      })
      .catch((err) => {
        console.warn('Failed to copy token! ', err);
        setIsCopyingToken(false);
      });
  };

  const parsedExpiry: number = existingApiToken ? parseExpiry(existingApiToken?.expiryDate) : 0;
  const tokenIsExpired: boolean = has(existingApiToken, 'expiryDate') && parsedExpiry <= 0;

  useEffect(() => {
    if (user) {
      const fetchApiKeysUrl = new URL(EGO_API_KEY_ENDPOINT);
      fetchApiKeysUrl.searchParams.append('sort', 'isRevoked');
      // sort by asc will get isRevoked=false first
      fetchApiKeysUrl.searchParams.append('sortOrder', 'ASC');
      fetchApiKeysUrl.searchParams.append('user_id', user.id);
      fetchApiKeysUrl.searchParams.append('limit', '1000');

      fetchWithAuth(fetchApiKeysUrl.href, { method: 'GET' })
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(
              `HTTP error ${res.status}: Your existing API tokens could not be fetched. `,
            );
          }
          return res.json();
        })
        .then((json) => {
          // first find all non-revoked tokens
          const unrevokedTokens = json.resultSet.filter((r: ApiToken) => !r.isRevoked);
          // then sort by expiry date
          const unrevokedTokensSortedByExpiry = orderBy(unrevokedTokens, 'expiryDate', ['desc']);
          // find most recent token that is not revoked and not expired, if it exists
          const activeToken = unrevokedTokensSortedByExpiry.find((r: ApiToken) => {
            const expiry = parseExpiry(r.expiryDate) || 0;
            return expiry > 0;
          });
          // display either this activeToken, or the most recently expired non-revoked token
          const tokenToDisplay = activeToken || unrevokedTokensSortedByExpiry[0];
          if (tokenToDisplay) {
            setExistingApiToken(tokenToDisplay);
          } else {
            setExistingApiToken(null);
          }
        })
        .catch((err: Error) => {
          setErrorMessage(err.message);
          console.warn(err.message);
        });
    }
  }, [token]);

  const userEffectiveScopes = (user?.scope || [])
    .map((s) => parseScope(s))
    .filter((s: ScopeObj) => {
      return s.accessLevel !== AccessLevel.DENY;
    });

  const userHasScopes = userEffectiveScopes.length > 0;

  return (
    <div>
      <h2
        css={(theme) =>
          css`
            ${theme.typography.regular};
            font-size: 24px;
            line-height: 40px;
            color: ${theme.colors.accent_dark};
          `
        }
      >
        API Token
      </h2>
      <ol
        css={(theme) =>
          css`
            ${theme.typography.subheading};
            font-weight: normal;
            color: ${theme.colors.accent_dark};
            margin-bottom: 1rem;
          `
        }
      >
        <li>Your API token is used to download controlled access data.</li>
        <li>
          Your API token is associated with your user credentials and should <strong>NEVER</strong>{' '}
          be shared with anyone.
        </li>
        <li>When you generate a new token, all previous tokens become invalid.</li>
        <li>Expired and revoked tokens also become invalid.</li>
      </ol>
      <div
        css={css`
          margin-bottom: 1rem;
          margin-top: 0.5rem;
        `}
      >
        {!userHasScopes && (
          <ErrorNotification title="Invalid Permissions" size="md">
            You do not have permissions to generate an API token. Please contact the{' '}
            <DMSAdminContact /> to gain the correct permissions.
          </ErrorNotification>
        )}
      </div>

      {errorMessage && (
        <div
          css={css`
            margin: 1.5rem 0;
          `}
        >
          <ErrorNotification
            size="sm"
            css={(theme) => css`
              background-color: ${theme.colors.error_1};
              color: ${theme.colors.accent_dark};
            `}
            dismissible
            onDismiss={() => setErrorMessage(null)}
          >
            <span
              css={css`
                font-size: 14px;
                display: block;
              `}
            >
              {typeof errorMessage === 'string' ? (
                <span>
                  {errorMessage}
                  <GenericHelpMessage />
                </span>
              ) : (
                errorMessage
              )}
            </span>
          </ErrorNotification>
        </div>
      )}
      <div
        css={css`
          display: flex;
          flex-direction: row;
          margin-bottom: 10px;
        `}
      >
        <Button
          css={css`
            margin-right: 10px;
          `}
          onClick={() => generateApiToken()}
          isAsync
          disabled={!userHasScopes}
        >
          Generate New Token
        </Button>
        <Button
          disabled={isEmpty(existingApiToken) || tokenIsExpired}
          isAsync
          css={(theme) =>
            css`
              background-color: ${theme.colors.white};
              color: ${theme.colors.accent_dark};
              border: 1px solid ${theme.colors.grey_5};
              &:hover {
                background-color: ${theme.colors.accent_1};
              }
            `
          }
          onClick={() => revokeApiToken()}
        >
          Revoke Token
        </Button>
      </div>
      <div
        css={css`
          position: relative;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 1rem;
          margin-top: 1rem;
          max-width: 600px;
        `}
      >
        <div
          css={(theme) =>
            css`
              border: 1px solid ${theme.colors.grey_5};
              border-radius: 5px 0px 0px 5px;
              border-right: 0px;
              color: ${isEmpty(existingApiToken) ? theme.colors.grey_6 : theme.colors.black};
              width: 100%;
              display: flex;
              align-items: center;
              padding-left: 5px;
            `
          }
        >
          {existingApiToken && (
            <div
              css={(theme) =>
                css`
                  color: ${theme.colors.white};
                  border-radius: 6px;
                  padding: 3px 8px;
                  margin-right: 5px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  ${theme.typography.label}
                  ${tokenIsExpired
                    ? `background-color: ${theme.colors.error_dark}`
                    : `background-color: ${theme.colors.grey_6};`}
                `
              }
            >
              {tokenIsExpired ? 'Expired' : getDayValue(parsedExpiry)}
            </div>
          )}
          <span
            css={(theme) => css`
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              ${theme.typography.subheading}
              font-weight: normal;
              padding-right: 5px;
              padding-left: 5px;
              ${tokenIsExpired ? 'opacity: 0.3' : ''}
            `}
          >
            {existingApiToken?.name || 'You have no API token...'}
          </span>
        </div>
        <>
          <Global
            styles={css`
              .tippy-popper .leave {
                opacity: 0;
              }
            `}
          />
          <Tooltip
            unmountHTMLWhenHide
            open={copySuccess}
            arrow
            html={
              <TooltipContainer theme={theme} id="tooltip">
                Copied!
              </TooltipContainer>
            }
            position="top"
          >
            <Button
              disabled={isEmpty(existingApiToken) || isCopyingToken || tokenIsExpired}
              css={() =>
                css`
                  border-radius: 0px 5px 5px 0px;
                  width: 69px;
                  height: 36px;
                  position: relative;
                `
              }
              onClick={() =>
                existingApiToken?.name && !tokenIsExpired
                  ? copyApiToken(existingApiToken.name)
                  : null
              }
            >
              <span
                css={css`
                  position: absolute;
                  top: 8px;
                  left: 24px;
                  visibility: ${copySuccess ? 'visible' : 'hidden'};
                `}
              >
                <Checkmark width={20} height={20} fill={theme.colors.white} />
              </span>
              <span
                css={css`
                  visibility: ${copySuccess ? 'hidden' : 'visible'};
                `}
              >
                Copy
              </span>
            </Button>
          </Tooltip>
        </>
      </div>
      <div
        css={css`
          margin-top: 2rem;
        `}
      >
        <span
          css={(theme) =>
            css`
              ${theme.typography.subheading};
              font-weight: normal;
              color: ${theme.colors.accent_dark};
            `
          }
        >
          For more information, please read the{' '}
          <StyledLink href={``}>instructions on how to download data</StyledLink>.
        </span>
      </div>
    </div>
  );
};

export default ApiTokenInfo;
