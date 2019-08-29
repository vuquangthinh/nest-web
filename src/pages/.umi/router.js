import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import RendererWrapper0 from '/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/auth',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/AuthLayout'),
          LoadingComponent: require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/AuthLayout').default,
    routes: [
      {
        path: '/auth',
        redirect: '/auth/login',
        exact: true,
      },
      {
        path: '/auth/login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/pages/Auth/models/reset-password.js').then(
                  m => {
                    return { namespace: 'reset-password', ...m.default };
                  },
                ),
              ],
              component: () => import('../Auth/Login'),
              LoadingComponent: require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/components/PageLoading/index')
                .default,
            })
          : require('../Auth/Login').default,
        name: 'login',
        exact: true,
      },
      {
        path: '/auth/reset-password',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/pages/Auth/models/reset-password.js').then(
                  m => {
                    return { namespace: 'reset-password', ...m.default };
                  },
                ),
              ],
              component: () => import('../Auth/ResetPassword'),
              LoadingComponent: require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/components/PageLoading/index')
                .default,
            })
          : require('../Auth/ResetPassword').default,
        name: 'reset-password',
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/BasicLayout'),
          LoadingComponent: require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    Routes: [require('../Authorized').default],
    authority: ['@'],
    routes: [
      {
        path: '/',
        exact: true,
        name: 'dashboard',
        icon: 'dashboard',
        hideInMenu: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/pages/Dashboard/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () => import('../Dashboard'),
              LoadingComponent: require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/components/PageLoading/index')
                .default,
            })
          : require('../Dashboard').default,
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
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/pages/Account/Settings/models/setting.js').then(
                      m => {
                        return { namespace: 'setting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../Account/Settings'),
                  LoadingComponent: require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/components/PageLoading/index')
                    .default,
                })
              : require('../Account/Settings').default,
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
                exact: true,
              },
              {
                path: '/account/settings/base',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/pages/Account/Settings/models/setting.js').then(
                          m => {
                            return { namespace: 'setting', ...m.default };
                          },
                        ),
                      ],
                      component: () => import('../Account/Settings/BaseView'),
                      LoadingComponent: require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Account/Settings/BaseView').default,
                name: 'default',
                exact: true,
              },
              {
                path: '/account/settings/security',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/pages/Account/Settings/models/setting.js').then(
                          m => {
                            return { namespace: 'setting', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import('../Account/Settings/SecurityView'),
                      LoadingComponent: require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../Account/Settings/SecurityView').default,
                name: 'security',
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            component: () =>
              React.createElement(
                require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        name: 'user',
        icon: 'fa::users',
        path: '/users',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/pages/User/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () => import('../User'),
              LoadingComponent: require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/components/PageLoading/index')
                .default,
            })
          : require('../User').default,
        authority: ['super'],
        exact: true,
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../404'),
              LoadingComponent: require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen = () => {};

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    routeChangeHandler(history.location);
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
