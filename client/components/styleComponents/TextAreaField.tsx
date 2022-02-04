import React from 'react';
import TextField from '@mui/material/TextField';

const TextAreaField = ({
  eHandler,
  label,
  type,
  errState,
  errMsg,
  required,
  defaultValue,
  rows,
  value,
}: {
  eHandler: (e: any) => void;
  label: string;
  type: string;
  errState?: boolean;
  errMsg?: string;
  required: boolean;
  defaultValue?: string;
  rows?: number;
  value?: any;
}) => {
  return errState === undefined ? (
    <TextField
      onChange={eHandler}
      required={required}
      variant='outlined'
      label={label}
      multiline
      rows={rows ? rows : 3}
      fullWidth
      type={type}
      defaultValue={defaultValue ? defaultValue : null}
      value={value ? value : null}
    />
  ) : (
    <TextField
      onChange={eHandler}
      required={required}
      variant='outlined'
      label={label}
      type={type}
      error={errState}
      helperText={errState ? `${errMsg}` : ''}
      multiline
      rows={rows ? rows : 3}
      fullWidth
      defaultValue={defaultValue ? defaultValue : null}
      value={value ? value : null}
    />
  );
};

export default TextAreaField;
