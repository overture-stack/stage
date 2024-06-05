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

import { useMemo, useState } from 'react';
import { css, useTheme } from '@emotion/react';

import Facets from './Facets';
import RepoTable from './RepoTable';
import QueryBar from './QueryBar';

const PageContent = () => {
	const theme = useTheme();
	const [showSidebar, setShowSidebar] = useState(true);

	const sidebarWidth = showSidebar ? theme.dimensions.facets.width : 0;

	return useMemo(
		() => (
			<div
				css={css`
					flex: 1;
					width: 100vw;
				`}
			>
				<div
					css={css`
						display: flex;
						flex-direction: row;
						margin-left: 0;
					`}
				>
					{/* WIP button to hide/show the sidebar
            <button
            css={css`
              position: absolute;
              top: 5px;
            `}
            onClick={() => setShowSidebar(!showSidebar)}
          >
            Show
          </button> */}
					<aside
						css={css`
							flex: 0 0 ${sidebarWidth}px;
							flex-direction: column;
							background-color: ${theme.colors.white};
							z-index: 1;
							${theme.shadow.right};
							height: calc(
								100vh - ${theme.dimensions.footer.height + theme.dimensions.navbar.height}px
							);
							overflow-y: scroll;
						`}
					>
						<Facets />
					</aside>
					<div
						css={css`
							display: flex;
							flex-direction: column;
							width: 100%;
							height: calc(
								100vh - ${theme.dimensions.footer.height + theme.dimensions.navbar.height}px
							);
							overflow-y: scroll;
						`}
					>
						<div
							css={css`
								flex: 8.5;
								margin: 0 15px 0 15px;
								max-width: calc(100vw - ${sidebarWidth + 10}px);
							`}
						>
							<QueryBar />
							<RepoTable />
						</div>
					</div>
				</div>
			</div>
		),
		[],
	);
};

export default PageContent;
