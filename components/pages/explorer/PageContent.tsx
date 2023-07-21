/*
 *
 * Copyright (c) 2021 The Ontario Institute for Cancer Research. All rights reserved
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

import { ReactNode, useMemo, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import { Rnd } from 'react-rnd';

import ScrollToTop from '@/components/ScrollToTop';
import { Chevron } from '../../theme/icons';
import Facets from './Facets';
import RepositoryContent from './RepositoryContent';
import QueryBar from './QueryBar';

const sidebarHeight = '100%';
const sidebarToggleWidth = 28;

const SidebarResizeWrapper = ({
  children,
  setSidebarWidth,
  sidebarDefaultWidth,
  sidebarVisible,
  sidebarWidth,
}: {
  children: ReactNode;
  setSidebarWidth: (width: number) => void;
  sidebarDefaultWidth: number;
  sidebarVisible: boolean;
  sidebarWidth: number;
}) => {
  const theme = useTheme();
  return (
    <Rnd
      bounds="parent"
      default={{
        x: 0,
        y: 0,
        width: sidebarDefaultWidth,
        height: sidebarHeight,
      }}
      disableDragging
      enableResizing={{
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
        left: false,
        right: true,
        top: false,
        topLeft: false,
        topRight: false,
      }}
      maxWidth="50%"
      minWidth="5%"
      maxHeight={sidebarHeight}
      onResize={(e, direction, ref) => {
        setSidebarWidth(ref.offsetWidth);
      }}
      size={{
        width: sidebarWidth,
        height: sidebarHeight,
      }}
      style={{
        top: `-${theme.dimensions.navbar.height}px`,
        bottom: theme.dimensions.footer.height,
        boxShadow: theme.shadow.right.split('box-shadow: ')[1].replace(';', ''),
        wordBreak: 'break-all',
        display: sidebarVisible ? 'block' : 'none',
      }}
    >
      {children}
    </Rnd>
  );
};

const SidebarToggle = ({
  sidebarVisible,
  toggleSidebarVisible,
}: {
  sidebarVisible: boolean;
  toggleSidebarVisible: () => void;
}) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        position: absolute;
        height: calc(100% - 20px);
        top: 10px;
        bottom: 10px;
        border: 0 none;
        background: none;
        display: ${sidebarVisible ? 'none' : 'block'};
      `}
    >
      <button
        css={css`
          height: 100%;
          display: block;
          border-radius: 0 100px 100px 0;
          background: ${theme.colors.white};
          border: 2px solid ${theme.colors.grey_2};
          border-left-width: 0;
          padding: 0 5px;
          cursor: pointer;
          &:hover {
            background: ${theme.colors.grey_1};
          }
        `}
        onClick={() => {
          toggleSidebarVisible();
        }}
      >
        <Chevron
          fill={theme.colors.accent}
          style={css`
            transform: rotate(-90deg);
          `}
          width={16}
          height={16}
        />
      </button>
    </div>
  );
};

const PageContent = () => {
  const theme = useTheme();

  // setup resizable sidebar
  const sidebarDefaultWidth = theme.dimensions.facets.width || 0;
  const [sidebarWidth, setSidebarWidth] = useState<number>(sidebarDefaultWidth);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

  const toggleSidebarVisible = () => {
    // toggle visibility with CSS display block/none
    // rather than a JSX ternary statement
    // in order to maintain the state of the facet panel
    setSidebarVisible(!sidebarVisible);
    setSidebarWidth(sidebarDefaultWidth);
  };

  const contentOffset = sidebarVisible ? sidebarWidth : sidebarToggleWidth;

  return useMemo(
    () => (
      <div
        css={css`
          position: relative;
        `}
      >
        <SidebarResizeWrapper
          setSidebarWidth={setSidebarWidth}
          sidebarDefaultWidth={sidebarDefaultWidth}
          sidebarVisible={sidebarVisible}
          sidebarWidth={sidebarWidth}
        >
          <ScrollToTop>
            <Facets />
          </ScrollToTop>
        </SidebarResizeWrapper>

        <SidebarToggle
          sidebarVisible={sidebarVisible}
          toggleSidebarVisible={toggleSidebarVisible}
        />

        <div
          css={css`
            position: absolute;
            left: ${contentOffset}px;
            width: calc(100% - ${contentOffset}px);
            height: 100%;
            padding: 0 15px;
            box-sizing: border-box;
          `}
        >
          <QueryBar />
          <RepositoryContent />
        </div>
      </div>
    ),
    [sidebarVisible, sidebarWidth],
  );
};

export default PageContent;
