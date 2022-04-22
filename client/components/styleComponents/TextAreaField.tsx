import React from 'react';
import TextField from '@mui/material/TextField';

const TextAreaField = ({
  eHandler,
  label,
  type,
  required,
  defaultValue,
  rows,
  value,
}: {
  eHandler: (e: any) => void;
  label: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  rows?: number;
  value?: any;
}) => {
  if (defaultValue) {
    return (
      <TextField
        onChange={eHandler}
        required={required}
        variant='outlined'
        label={label}
        multiline
        rows={rows ? rows : 3}
        fullWidth
        type={type}
        defaultValue={defaultValue ? defaultValue : ''}
      />
    );
  } else if (value) {
    return (
      <TextField
        onChange={eHandler}
        required={required}
        variant='outlined'
        label={label}
        multiline
        rows={rows ? rows : 3}
        fullWidth
        type={type}
        value={value ? value : ''}
      />
    );
  } else {
    return (
      <TextField
        onChange={eHandler}
        required={required}
        variant='outlined'
        label={label}
        multiline
        rows={rows ? rows : 3}
        fullWidth
        type={type}
      />
    );
  }
};

export default TextAreaField;
