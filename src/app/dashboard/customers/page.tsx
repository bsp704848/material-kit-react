// src/app/dashboard/customers/page.tsx
'use client'
import * as React from 'react';
import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import { paths } from '@/paths';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../server/lib/firebase';



export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const page = 0;
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchCustomers = async (): Promise<void> => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(),
      })) as Customer[];
      setCustomers(usersData);
    };

    void fetchCustomers();
  }, []);

  const deleteCustomerById = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', id));
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" component={RouterLink} href={paths.dashboard.addusers}>
            Add Users
          </Button>
        </div>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onDelete={deleteCustomerById} // Pass the delete function to the table component
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
