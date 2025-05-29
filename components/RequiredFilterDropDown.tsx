/*
 *
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
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

import { FC, useState } from 'react';
import Dropdown from './DropDown/DropDown';
import ListFilter from './theme/icons/list_filter';
type RequiredFilterDropDownProps = {
	onChange: (tableColumn: any) => void;
	setIsFiltered: (bool: boolean) => void;
	columns: any[];
	isFiltered: boolean;
};
// This component is going to take in a list of columns and return an array of columns with certain columns filtered out based
// on the required filter
const RequiredFilterDropDown: FC<RequiredFilterDropDownProps> = ({ setIsFiltered, isFiltered, onChange, columns }) => {
	//Note the indexing is fully reliant on the order of the columns in the array which is done in the tableInit.ts

	const dropDownOptionsOb = [
		{
			label: isFiltered ? 'Show All Columns' : 'Filter by Required',
			action: () => {
				if (isFiltered) {
					onChange(columns);
					setIsFiltered(false);
				} else {
					const filteredColumns = columns.filter(
						(column) => column.header === 'Required' || column.header === 'SchemaField',
					);
					onChange(filteredColumns);
					setIsFiltered(true);
				}
			},
		},
	];

	return (
		<>
			<Dropdown menuItems={dropDownOptionsOb} leftIcon={<ListFilter />} title="Required Filter" />
		</>
	);
};
export default RequiredFilterDropDown;
