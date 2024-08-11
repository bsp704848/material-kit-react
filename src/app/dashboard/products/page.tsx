// src/app/dashboard/products/page.tsx
"use client"

import React, { useState } from 'react';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { ProductsFilters } from '@/components/dashboard/products/products-filter';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Grid, CircularProgress } from '@mui/material';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const { loading} = useDashboardData();

  if (loading) {
    return (
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{height:'100hv'}}>
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    )
  }
  return (
    <div>
      <ProductsFilters searchTerm={searchTerm} onSearch={setSearchTerm} />
      <br />
      <LatestProducts searchTerm={searchTerm} paginate={true} />
    </div>
  );
}
