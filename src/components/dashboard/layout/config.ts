// /src/components/dashboard/layout/config.ts

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'products', title: 'Products', href: paths.dashboard.products, icon: 'users'},
  { key: 'customers', title: 'Users', href: paths.dashboard.customers, icon: 'users' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },

] satisfies NavItemConfig[];
