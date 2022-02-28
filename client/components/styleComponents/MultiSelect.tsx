import React from 'react';
import { MultipleSelect } from 'react-select-material-ui';
import { MultiSelectOption } from '../../constants/STYLE_INTERFACE';

const MultiSelect = ({
	items,
	dispatch,
	state,
}: {
	items: MultiSelectOption[];
	dispatch: (ids: number[]) => void;
	state: number[];
}) => {
	const handleChange = (ids) => {
		dispatch(ids);
	};
	return (
		<MultipleSelect
			label='Choose some options'
			values={state}
			options={items}
			onChange={handleChange}
			SelectProps={{
				isCreatable: false,
				isClearable: true,
				msgNoOptionsAvailable: 'All options are selected',
				msgNoOptionsMatchFilter: 'No options matches the filter',
			}}
		/>
	);
};

export default MultiSelect;
