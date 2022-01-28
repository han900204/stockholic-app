import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Btn = ({ text }) => {
  return (
    <Box sx={{ '& button': { m: 1 } }}>
      <Button variant='contained' size='medium' type='submit'>
        {text}
      </Button>
    </Box>
  );
};

export default Btn;
