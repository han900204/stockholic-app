import React from 'react';
import Box from '@mui/material/Box';

const TextBox = ({ data }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 300,
        backgroundColor: '#e3f2fd',
        overflow: 'scroll',
      }}
    >
      {data}
    </Box>
  );
};

export default TextBox;
