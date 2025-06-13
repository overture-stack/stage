import { FC } from 'react';
import Dropdown from './Dropdown/Dropdown';
import { FilterMapping } from './pages/data-dictionary';
import type { FilterOptions } from './pages/data-dictionary';
type FilterDropdownProps = {
	filters: FilterMapping;
	setFilters: (filters: FilterMapping) => void;
};

const FilterDropdown = ({ filters, setFilters }: FilterDropdownProps) => {
	const handleFilterSelect = (selectedFilterName: FilterOptions) => {
		// If we click the filter again then we want to toggle it off, iff it is the same filter being clicked
		// and it is currently active
		if (filters.active && filters.constraints?.includes(selectedFilterName)) {
			setFilters({ active: false, constraints: [] });
			return;
		}
		setFilters({ active: true, constraints: [selectedFilterName] });
	};
	const menuItems = [
		{
			label: 'Required Only',
			action: () => handleFilterSelect('Required'),
		},
		{
			label: 'All Fields',
			action: () => handleFilterSelect('All Fields'),
		},
	];

	return <Dropdown title="Filter" menuItems={menuItems} />;
};

export default FilterDropdown;
