import React from 'react';
import TextField from '@mui/material/TextField';

const TextArea = ({
  eHandler,
  label,
  type,
  errState,
  errMsg,
  required,
}: {
  eHandler: (e: any) => void;
  label: string;
  type: string;
  errState?: boolean;
  errMsg?: string;
  required: boolean;
}) => {
  return errState === undefined ? (
    <TextField
      onChange={eHandler}
      required={required}
      variant='outlined'
      label={label}
      multiline
      rows={3}
      minRows={3}
      maxRows={Infinity}
      fullWidth
      type={type}
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
      rows={3}
      minRows={3}
      maxRows={Infinity}
      fullWidth
    />
  );
};

export default TextArea;
