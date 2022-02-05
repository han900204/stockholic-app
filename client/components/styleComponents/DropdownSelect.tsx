import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@material-ui/core';

const DropdownSelect = ({
  name,
  eHandler,
  data,
  state,
  displayVar,
}: {
  name: string;
  eHandler: (e: any) => void;
  data: any[];
  state: any;
  displayVar: string;
}) => {
  return (
    <>
      <Select
        onChange={(e) => {
          eHandler(e.target.value);
        }}
        className='dropdown-menu'
        color='secondary'
        variant='outlined'
        value={state}
        displayEmpty
        required
        style={{ minWidth: 100 }}
      >
        <MenuItem value='' disabled>
          {name}
        </MenuItem>
        {data.map((d, idx) => (
          <MenuItem key={idx} value={d.id}>
            {d[displayVar]}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default DropdownSelect;
