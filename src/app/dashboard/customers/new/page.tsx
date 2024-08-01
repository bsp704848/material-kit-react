import { AdminGuard } from '@/components/auth/AdminGuard';
import { UsersForm } from '@/components/dashboard/customer/users-form';
import EditProductForm from '@/components/dashboard/products/edit-products-form';
import React from 'react';

export default function Page(): React.JSX.Element {
  return (
    <div>
      <AdminGuard>
      <UsersForm />
      </AdminGuard>
    </div>
  );
}
