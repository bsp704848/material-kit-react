import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'sales', title: 'Sales', href: paths.dashboard.sales, icon: 'chart-pie' },
  { key: 'tickets', title: 'Tickets', href: paths.dashboard.tickets, icon: 'ticket' },
  { key: 'categories', title: 'Categories', href: paths.dashboard.categories, icon: 'categories' },
  { key: 'games', title: 'Games', href: paths.dashboard.games, icon: 'game' },
  { key: 'users', title: 'Users', href: paths.dashboard.users, icon: 'users' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
] satisfies NavItemConfig[];
