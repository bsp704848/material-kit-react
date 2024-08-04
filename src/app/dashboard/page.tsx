'use client';
import * as React from 'react';
import { Button, Grid, Link } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import dynamic from 'next/dynamic';
import { useDashboardData } from '@/hooks/useDashboardData';
import { paths } from '@/paths';
import RouterLink from 'next/link';
import { Loading } from '@/components/loading/loading';
// Dynamically import components for better performance
const Budget = dynamic(() => import('@/components/dashboard/overview/budget').then((mod) => mod.Budget));
const LatestProducts = dynamic(() => import('@/components/dashboard/overview/latest-products').then((mod) => mod.LatestProducts));
const TotalCustomers = dynamic(() => import('@/components/dashboard/overview/total-customers').then((mod) => mod.TotalCustomers));

export default function Page(): React.JSX.Element {
  const { loading, numProducts, numUsers } = useDashboardData();

  const renderDashboard = React.useCallback(() => (
    <Grid container spacing={3} alignItems="stretch">
      <Grid container item spacing={3} xs={12} alignItems="flex-start">
        <Grid item lg={3} sm={6} xs={12} style={{ flex: 1 }}>
          <Budget diff={12} trend="up" sx={{ height: '100%' }} value={`${numProducts} Items`} />
        </Grid>
        <Grid item lg={3} sm={6} xs={12} style={{ flex: 1 }}>
          <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={`${numUsers} Users`} />
        </Grid>
      </Grid>
      <Grid container item xs={12} justifyContent="flex-end">
        <Grid item>
          <Link component={RouterLink} href={paths.dashboard.newproduct}>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
              Add
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <LatestProducts sx={{ height: '100%' }} searchTerm="" limit={5} />
      </Grid>
    </Grid>
  ), [numProducts, numUsers]);

  return loading ? <Loading /> : renderDashboard();
}
