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

import { useMemo, useState } from 'react';
import { useTheme } from '@emotion/react';

import ScrollToTop from '@/components/ScrollToTop';
import Facets from './Facets';
import RepositoryContent from './RepositoryContent';
import QueryBar from './QueryBar';
import { Rnd } from 'react-rnd';

const PageContent = () => {
  const theme = useTheme();

  // dimensions for resizable sidebar
  const sidebarDefaultWidth = theme.dimensions.facets.width || 0;
  const [sidebarWidth, setSidebarWidth] = useState(sidebarDefaultWidth);
  const sidebarHeight = '100%';

  return useMemo(
    () => (
      <div style={{ position: 'relative' }}>
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
            boxShadow: theme.shadow.right.split('box-shadow: ')[1],
            wordBreak: 'break-all',
          }}
        >
          <ScrollToTop>
            <Facets />
          </ScrollToTop>
        </Rnd>
        <div
          style={{
            position: 'absolute',
            left: sidebarWidth,
            width: `calc(100% - ${sidebarWidth}px)`,
            height: '100%',
            padding: '0 15px',
            boxSizing: 'border-box',
          }}
        >
          <QueryBar />
          <RepositoryContent />
        </div>
      </div>
    ),
    [],
  );
};

export default PageContent;
