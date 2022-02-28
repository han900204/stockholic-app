import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function SingleSelect({ fieldName, state, setState, options }) {
	const handleChange = (e: SelectChangeEvent) => {
		setState(e.target.value);
	};

	return (
		<div>
			<FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
				<InputLabel id='demo-simple-select-standard-label'>
					{fieldName}
				</InputLabel>
				<Select
					labelId='demo-simple-select-standard-label'
					id='demo-simple-select-standard'
					value={state}
					onChange={handleChange}
					label={fieldName}
				>
					{options.map((option, idx) => (
						<MenuItem key={idx} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}
