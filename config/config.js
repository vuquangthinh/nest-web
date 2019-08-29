// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      // hd: true,
      fastClick: true,
      dva: {
        hmr: true,
      },
      targets: {
        ie: 11,
      },
      locale: {
        enable: !true, // default false
        default: 'en-US', // 'vi-VN', // default zh-CN
        baseNavigator: false, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: false,
          }
        : {}),
    },
  ],
];

// judge add ga
// if (process.env.APP_TYPE === 'site') {
//   plugins.push([
//     'umi-plugin-ga',
//     {
//       code: 'UA-72788897-6',
//     },
//   ]);
// }

export default {
  // add for transfer to umi
  plugins,
  // base: process.env.APP_BASE || '/admin/',
  // publicPath: process.env.APP_BASE || '/admin/',
  targets: {
    ie: 11,
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',

    'process.env': (() => {
      const envKeys = Object.keys(process.env).filter(field => {
        if (field.startsWith('APP__')) {
          return true;
        }

        return false;
      });
      return envKeys.reduce(
        (r, v) => ({
          ...r,
          [v]: process.env[v],
        }),
        {}
      );
    })(),
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'border-radius-base': 0,
    'border-color-base': '#e6e8f0',
    'strong-color': '#0d132e',
    'mark-color': '#3f476b',
    'mark-light-color': '#878da3',
    'content-background-color': '#f9f9fc',
    'thead-background-color': '#e6e8f0',
    'row-even-bg-color': '#fdfeff',
    'row-odd-bg-color': '#fafbfc',
    'drawer-background-color': '#f4f5fa',
    'border-content-color': '#dcdde2'
  },
  alias: {},
  externals: {
    '@antv/data-set': 'DataSet',
  },
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin,
};

