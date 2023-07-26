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
import { find } from 'lodash';
import Button from '@/components/Button';
import { CustomTooltip } from '@/components/Tooltip';
import { ButtonWrapper } from '../ActionBar';
import { RepositoryTabNames } from '../RepositoryContent';
import { useTabsContext } from '../TabsContext';
import useEnableJbrowse from './useEnableJbrowse';

const JbrowseLaunchButton = () => {
  const theme = useTheme();
  const { handleChangeTab, handleOpenTab, openTabs } = useTabsContext();
  const { jbrowseEnabled, jbrowseErrorText, jbrowseLoading } = useEnableJbrowse();

  return (
    <CustomTooltip
      disabled={jbrowseEnabled}
      unmountHTMLWhenHide
      arrow
      html={
        <div
          css={css`
            ${theme.typography.regular};
            font-size: 12px;
          `}
        >
          {jbrowseErrorText}
        </div>
      }
      position="right"
    >
      <ButtonWrapper>
        <Button
          isLoading={jbrowseLoading}
          css={css`
            padding: 2px 10px;
          `}
          disabled={!jbrowseEnabled}
          onClick={() => {
            // go to jbrowse tab if open, otherwise add jbrowse tab
            if (find(openTabs, { name: RepositoryTabNames.JBROWSE })) {
              handleChangeTab(RepositoryTabNames.JBROWSE);
            } else {
              handleOpenTab({ name: RepositoryTabNames.JBROWSE, canClose: true });
            }
          }}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <img
              src="images/jbrowse-logo.png"
              alt=""
              width={16}
              css={css`
                margin-right: 0.3rem;
              `}
            />
            <span>JBrowse</span>
          </div>
        </Button>
      </ButtonWrapper>
    </CustomTooltip>
  );
};

export default JbrowseLaunchButton;
