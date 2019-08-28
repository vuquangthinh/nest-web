export default [
  // authenticate
  {
    path: '/auth',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/auth', redirect: '/auth/login' },
      { path: '/auth/login', component: './Auth/Login', name: 'login' },
      { path: '/auth/reset-password', component: './Auth/ResetPassword', name: 'reset-password' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['@'],
    routes: [
      {
        path: '/',
        exact: true,
        name: 'dashboard',
        icon: 'dashboard',
        hideInMenu: true,
        // redirect: '/users'
        component: './Dashboard',
        authority: ['@'],
      },
      {
        hideInMenu: true,
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
                name: 'default',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
                name: 'security',
              },
              // {
              //   path: '/account/settings/binding',
              //   component: './Account/Settings/BindingView',
              // },
              // {
              //   path: '/account/settings/notification',
              //   component: './Account/Settings/NotificationView',
              // },
            ],
          },
        ],
      },
      {
        name: 'user',
        icon: 'fa::users',
        path: '/users',
        component: './User',
        authority: ['super'],
      },

      {
        name: 'finance',
        icon: 'fas::credit-card',
        path: '/finances',
        component: './Finance',
        authority: ['admin'],
      },
      {
        component: '404',
      },
    ],
  },
];
