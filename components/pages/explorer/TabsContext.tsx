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

import { findIndex } from 'lodash';
import { PropsWithChildren, ReactElement, createContext, useContext, useState } from 'react';

export type TabRecord = {
	name: string;
	canClose: boolean;
};

export interface TabsContextInterface {
	activeTab: string | null;
	handleOpenTab: (tab: TabRecord) => void;
	handleChangeTab: (tabName: string) => void;
	handleCloseTab: (tabName: string) => void;
	openTabs: TabRecord[];
}

export const TabsContext = createContext<TabsContextInterface>({
	activeTab: null,
	openTabs: [],
} as unknown as TabsContextInterface);

export const TabsContextProvider = ({
	defaultTabs,
	children,
}: PropsWithChildren<{
	defaultTabs: TabRecord[];
}>): ReactElement<TabsContextInterface> => {
	const [openTabs, setOpenTabs] = useState<TabRecord[]>(defaultTabs);
	const [activeTab, setActiveTab] = useState<string | null>(defaultTabs[0]?.name || null);

	const handleOpenTab = (tab: TabRecord) => {
		setOpenTabs(openTabs.concat(tab));
		setActiveTab(tab.name);
	};
	const handleCloseTab = (tabName: string) => {
		// if removed tab was active, set active tab to previous tab in the list
		if (activeTab === tabName) {
			const nextActiveTab = openTabs[findIndex(openTabs, { name: tabName }) - 1 || 0]?.name || null;
			handleChangeTab(nextActiveTab);
		}
		const nextOpenTabs = openTabs.filter((openTab) => openTab.name !== tabName);
		setOpenTabs(nextOpenTabs);
	};
	const handleChangeTab = (tabName: string | null) => {
		setActiveTab(tabName);
	};

	const contextValues = {
		activeTab,
		handleOpenTab,
		handleChangeTab,
		handleCloseTab,
		openTabs,
	};

	return <TabsContext.Provider value={contextValues}>{children}</TabsContext.Provider>;
};

export const useTabsContext = (): TabsContextInterface => useContext(TabsContext);
