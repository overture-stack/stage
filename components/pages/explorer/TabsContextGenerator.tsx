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
import { createContext, PropsWithChildren, useState } from 'react';

// this file creates a generic context component for handling tabs.
// you can use it to create a custom tab context (example: RepositoryTabsContext)

export type TabRecord<TabKey extends string> = {
	name: string;
	key: TabKey;
	canClose: boolean;
};

export interface TabsContextInterface<TabKey extends string> {
	activeTab?: TabKey;
	handleSwitchTab: (tabKey: TabKey) => void;
	handleCloseTab: (tabKey: TabKey) => void;
	handleOpenTab: (tab: TabRecord<TabKey>) => void;
	handleUpdateTab: (tabKey: TabKey, updateObject: Partial<TabRecord<TabKey>>) => void;
	openTabs: TabRecord<TabKey>[];
}

export const TabContextGenerator = <TabKey extends string>({
	defaultTabs,
}: {
	defaultTabs: TabRecord<TabKey>[];
}) => {
	const [openTabs, setOpenTabs] = useState<TabRecord<TabKey>[]>(defaultTabs);
	const [activeTab, setActiveTab] = useState<TabKey | undefined>(defaultTabs[0]?.key);

	const handleOpenTab = (tab: TabRecord<TabKey>) => {
		setOpenTabs(openTabs.concat(tab));
		setActiveTab(tab.key);
	};

	const handleCloseTab = (tabKey: TabKey) => {
		// if removed tab was active, set active tab to previous tab in the list
		if (activeTab === tabKey) {
			const nextActiveTab = openTabs[findIndex(openTabs, (i) => i.key === tabKey) - 1 || 0]?.key;
			handleSwitchTab(nextActiveTab);
		}
		const nextOpenTabs = openTabs.filter((openTab) => openTab.key !== tabKey);
		setOpenTabs(nextOpenTabs);
	};

	const handleUpdateTab = (tabKey: TabKey, updateObject: Partial<TabRecord<TabKey>>) => {
		const nextOpenTabs = openTabs.map((tab) =>
			tab.key === tabKey ? { ...tab, ...updateObject } : tab,
		);
		setOpenTabs(nextOpenTabs);
	};

	const handleSwitchTab = (tabKey?: TabKey) => {
		setActiveTab(tabKey);
	};

	const contextValues = {
		activeTab,
		handleCloseTab,
		handleOpenTab,
		handleSwitchTab,
		handleUpdateTab,
		openTabs,
	};
	const TabsContext = createContext<TabsContextInterface<TabKey>>(contextValues);

	return {
		provider: (props: PropsWithChildren<{}>) => (
			<TabsContext.Provider value={contextValues}>{props.children}</TabsContext.Provider>
		),
		context: TabsContext,
	};
};
