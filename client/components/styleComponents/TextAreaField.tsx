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
}: {
  eHandler: (e: any) => void;
  label: string;
  type: string;
  errState?: boolean;
  errMsg?: string;
  required: boolean;
  defaultValue?: string;
  rows?: number;
}) => {
  return errState === undefined ? (
    <TextField
      onChange={eHandler}
      required={required}
      variant='outlined'
      label={label}
      multiline
      rows={rows ? rows : 3}
      minRows={3}
      maxRows={Infinity}
      fullWidth
      type={type}
      defaultValue={defaultValue ? defaultValue : null}
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
      minRows={3}
      maxRows={Infinity}
      fullWidth
      defaultValue={defaultValue ? defaultValue : null}
    />
  );
};

export default TextAreaField;
