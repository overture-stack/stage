import { FC } from 'react';
import Dropdown from './Dropdown/Dropdown';
import { Dictionary } from '@overture-stack/lectern-client';

type FilterDropdownProps = {
	data: Dictionary;
	isFiltered: boolean;
	setFilteredData: (dict: Dictionary) => void;
	setIsFiltered: (bool: boolean) => void;
};

const FilterDropdown: FC<FilterDropdownProps> = ({ data, isFiltered, setFilteredData, setIsFiltered }) => {
	const handleFilterSelect = (selectedFilterName: string) => {
		if (isFiltered) {
			setFilteredData(data);
			setIsFiltered(false);
			return;
		}

		if (selectedFilterName === 'Required') {
			const filteredDictionary: Dictionary = {
				...data,
				schemas: data.schemas.map((schema) => ({
					...schema,
					fields: schema.fields.filter((field: any) => field?.restrictions?.required === true),
				})),
			};
			setFilteredData(filteredDictionary);
		}
		// Add more filters here as needed
		// Follow the same pattern as above for additional filters
		// If we have a lot of filtering logic, we might want to consider moving this logic into a separate utility function
		else {
			setFilteredData(data);
		}

		setIsFiltered(true);
	};

	// We can easily define more filters here in the future
	const menuItems = [
		{
			label: 'Required',
			action: () => handleFilterSelect('Required'),
		},
	];

	return <Dropdown title="Filter" menuItems={menuItems} />;
};

export default FilterDropdown;
