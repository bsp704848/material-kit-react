export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password', adminUserForm: '/auth/admin' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    products: '/dashboard/products',
    newproduct: '/dashboard/products/new',
    editproduct: '/dashboard/products/edit',
    addusers: '/dashboard/customers/new',


  },
  errors: { notFound: '/errors/not-found' },
} as const;
