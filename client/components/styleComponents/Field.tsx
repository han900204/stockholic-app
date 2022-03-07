import React from 'react';
import TextField from '@mui/material/TextField';

const Field = ({
	eHandler,
	label,
	type,
	errState,
	errMsg,
}: {
	eHandler: (e: any) => void;
	label: string;
	type: string;
	errState?: boolean;
	errMsg?: string;
}) => {
	if (type === undefined) type = 'text';
	return errState === undefined ? (
		<TextField
			onChange={eHandler}
			required
			variant='outlined'
			label={label}
			type={type}
		/>
	) : (
		<TextField
			onChange={eHandler}
			required
			variant='outlined'
			label={label}
			type={type}
			error={errState}
			helperText={errState ? `${errMsg}` : ''}
		/>
	);
};

export default Field;
