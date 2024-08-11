'use client'
import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import Loading from '@/components/loading/loading'; // Import the Loading component

import { config } from '@/config';
import { Notifications } from '@/components/dashboard/settings/notifications';
import { UpdatePasswordForm } from '@/components/dashboard/settings/update-password-form';


export default function Page(): React.JSX.Element {
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate loading data or performing some async operation
    const loadSettings = async () => {
      try {
        // Simulate a delay for loading settings
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false); // Set loading to false after the operation
      }
    };

    loadSettings();
  }, []);

  if (loading) {
    return <Loading />; // Show loading component while fetching data
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Settings</Typography>
      </div>
      <Notifications />
      <UpdatePasswordForm />
    </Stack>
  );
}
