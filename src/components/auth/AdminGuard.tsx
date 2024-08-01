// src/components/auth/AdminGuard.tsx

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { paths } from '@/paths';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, isLoading } = useUser();

  React.useEffect(() => {
    if (!isLoading) {
      console.log('User:', user);  // Add this line
      if (!user) {
        // User is not authenticated, redirect to the sign-in page
        router.replace(paths.auth.signIn);
      } else if (user.role !== 'admin') {
        // User is authenticated but not an admin, redirect to the home page
        router.replace(paths.home);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'admin') {
    // You can show a loading spinner or a "Not Authorized" message here if needed
    return null;
  }

  return <>{children}</>;
}
