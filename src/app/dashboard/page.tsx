'use client'
import * as React from 'react';
import RouterLink from 'next/link';
import { paths } from '@/paths';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, CircularProgress } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import Link from '@mui/material/Link';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../server/lib/firebase'; // Adjust the import path as needed

export default function Page(): React.JSX.Element {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [numProducts, setNumProducts] = React.useState<number>(0);
  const [numUsers, setNumUsers] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const usersSnapshot = await getDocs(collection(db, 'users'));

        setNumProducts(productsSnapshot.size);
        setNumUsers(usersSnapshot.size);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <Grid>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
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
      <Grid item xs={12} container justifyContent="flex-end">
      </Grid>
    </Grid>
  );
}
