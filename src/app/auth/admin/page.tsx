// src/pages/auth/admin.tsx

import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { Layout } from '@/components/auth/layout';
import { AdminCreateUserForm } from '@/components/auth/AdminCreateUserForm';

export const metadata = { title: `Sign up | Auth | ${config.site.name}` } satisfies Metadata;

export default function AdminPage(): React.JSX.Element {
  return (
    <Layout>
      <AdminGuard>
        <AdminCreateUserForm />
      </AdminGuard>
    </Layout>
  );
}
