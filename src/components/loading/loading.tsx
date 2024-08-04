'use client';
import * as React from 'react';
import { Grid, CircularProgress } from '@mui/material';

export function Loading(): React.JSX.Element {
  return (
    <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  );
}
