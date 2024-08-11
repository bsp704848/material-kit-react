// src/components/Loading.tsx
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress'; // Example with Material-UI, adjust based on your setup

export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </div>
  );
}
