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

import { PropsWithChildren, ReactElement, createContext, useContext, useState } from 'react';

export enum RepoTableTabs {
	FILES = 'Files',
	JBROWSE = 'JBrowse',
}

export const defaultRepoTableTabs = [RepoTableTabs.FILES];

export interface RepoTableTabsContextInterface {
	activeTab: RepoTableTabs;
	handleAddTab: (tab: RepoTableTabs) => void;
	handleChangeTab: (tab: RepoTableTabs) => void;
	handleRemoveTab: (tab: RepoTableTabs) => void;
	openTabs: RepoTableTabs[];
}

export const RepoTableTabsContext = createContext<RepoTableTabsContextInterface>({
	openTabs: defaultRepoTableTabs,
	activeTab: defaultRepoTableTabs[0],
} as unknown as RepoTableTabsContextInterface);

export const RepoTableTabsContextProvider = ({
	children,
}: PropsWithChildren<{}>): ReactElement<RepoTableTabsContextInterface> => {
	const [openTabs, setOpenTabs] = useState<RepoTableTabs[]>(defaultRepoTableTabs);
	const [activeTab, setActiveTab] = useState<RepoTableTabs>(defaultRepoTableTabs[0]);

	const handleAddTab = (tab: RepoTableTabs) => {
		setOpenTabs([...openTabs, tab]);
		setActiveTab(tab);
	};
	const handleRemoveTab = (tab: RepoTableTabs) => {
		setOpenTabs(openTabs.filter((openTabs) => openTabs !== tab));
		setActiveTab(openTabs[openTabs.indexOf(tab) - 1 || 0]);
	};
	const handleChangeTab = (tab: RepoTableTabs) => {
		setActiveTab(tab);
	};

	const contextValues = {
		activeTab,
		handleAddTab,
		handleChangeTab,
		handleRemoveTab,
		openTabs,
	};

	return (
		<RepoTableTabsContext.Provider value={contextValues}>{children}</RepoTableTabsContext.Provider>
	);
};

export const useRepoTableTabsContext = (): RepoTableTabsContextInterface =>
	useContext(RepoTableTabsContext);
