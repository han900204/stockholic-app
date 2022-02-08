import React from 'react';
import { MultipleSelect } from 'react-select-material-ui';
import { MultiSelectOption } from '../../constants/STYLE_INTERFACE';

const MultiSelect = ({
  items,
  dispatch,
  state,
}: {
  items: MultiSelectOption[];
  dispatch: (id: number) => void;
  state: number[];
}) => {
  const handleChange = (id) => {
    dispatch(id);
  };
  return (
    <MultipleSelect
      label='Choose some cities'
      values={state}
      options={items}
      helperText='You can add a new city by writing its name and pressing enter'
      onChange={handleChange}
      SelectProps={{
        isCreatable: false,
        isClearable: true,
        msgNoOptionsAvailable: 'All users are selected',
        msgNoOptionsMatchFilter: 'No user name matches the filter',
      }}
    />
  );
};

export default MultiSelect;
