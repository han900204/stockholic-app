import React from 'react';
import Typography from '@mui/material/Typography';

const Subheading = ({ title }) => {
  return (
    <>
      <Typography
        variant='h4'
        component='div'
        gutterBottom
        sx={{ my: 3, width: '80%' }}
      >
        {title}
      </Typography>
    </>
  );
};

export default Subheading;
