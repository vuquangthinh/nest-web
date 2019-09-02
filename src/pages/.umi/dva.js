import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'constant', ...(require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/models/constant.js').default) });
app.model({ namespace: 'global', ...(require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/models/global.js').default) });
app.model({ namespace: 'identity', ...(require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/models/identity.js').default) });
app.model({ namespace: 'login', ...(require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/models/menu.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/models/setting.js').default) });
app.model({ namespace: 'story', ...(require('/Users/quangthinh/Documents/Teamsoft/nestapi/web/src/models/story.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
