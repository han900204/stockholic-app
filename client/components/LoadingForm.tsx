import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function CircularIndeterminate() {
  return (
    <Grid
      container
      spacing={0}
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        <Box sx={{ mx: 'auto', my: 'auto' }}>
          <CircularProgress />
        </Box>
      </Grid>
    </Grid>
  );
}
