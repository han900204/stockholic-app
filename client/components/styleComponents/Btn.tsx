import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Btn = ({
  text,
  type,
  eHandler,
}: {
  text: string;
  type: any;
  eHandler?: (e: any) => void;
}) => {
  return eHandler === undefined ? (
    <Box sx={{ '& button': { m: 1 } }}>
      <Button variant='contained' size='medium' type={type}>
        {text}
      </Button>
    </Box>
  ) : (
    <Box sx={{ '& button': { m: 1 } }}>
      <Button variant='contained' size='medium' type={type} onClick={eHandler}>
        {text}
      </Button>
    </Box>
  );
};

export default Btn;
