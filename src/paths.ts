export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    sales: '/dashboard',
    tickets: '/dashboard/tickets',
    categories: '/dashboard/categories',
    games: '/dashboard/games',
    users: '/dashboard/users',
    settings: '/dashboard/settings',
  },
} as const;
