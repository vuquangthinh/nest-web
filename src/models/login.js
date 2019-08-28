import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { notification } from 'antd';
import { formatMessage  } from 'umi/locale';
import { getFakeCaptcha } from '@/services/api';
import { login, logout, requestActivateByToken, saveTokens } from '@/services/auth';
import { setAuthority } from '@/utils/authority';
import { dispatchEventInPayload } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    loading: true,
    status: undefined,
  },

  effects: {
    *login({ payload, ...other }, { call, put }) {
      try {
        const response = yield call(login, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: response.success,
            type: 'account',
            permissions: response.permissions || [],
          },
        });

        // Login successfully
        if (response.success) {
          reloadAuthorized();
          // const urlParams = new URL(window.location.href);
          // const params = getPageQuery();
          // let { redirect } = params;

          // if (redirect) {

          //   const redirectUrlParams = new URL(redirect);
          //   if (redirectUrlParams.origin === urlParams.origin) {
          //     redirect = redirect.substr(urlParams.origin.length);

          //     if (redirect.startsWith('/#')) {
          //       redirect = redirect.substr(2);
          //     }
          //   } else {
          //     window.location.href = redirect;
          //     return;
          //   }
          // }

          // yield put(routerRedux.replace(redirect || '/'));
          yield put({
            type: 'defaults/update',
            payload: response.decoded
          });

          yield put(routerRedux.replace('/'));
        }

        dispatchEventInPayload(response, other);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('err', e);
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put, call }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          permissions: [],
        },
      });

      yield call(logout);

      reloadAuthorized();

      // goto login screen
      yield put(
        routerRedux.push({
          pathname: '/auth/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },

    *autoLogin({ payload }, { call, put }) {
      // auto login
      try {
        const response = yield call(saveTokens, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: response.success,
            type: 'account',
            permissions: response.permissions || [],
          },
        });

        yield put({
          type: 'defaults/update',
          payload: response.decoded
        });

        // Login successfully
        if (response.success) {
          reloadAuthorized();
          yield put(routerRedux.replace('/'));
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('err', e);
      }

      yield put({ type: 'loading', payload: false });
    },

    *activate({ payload }, { call, put }) {
      const { activateCode } = payload;
      const result = yield call(requestActivateByToken, activateCode);
      if (result.success) {

        setTimeout(() => {
          notification.success({
            message: formatMessage({ id: 'module.login.activateSuccess' })
          });
        }, 1000);

        yield put({
          type: 'autoLogin',
          payload: result
        });
        return;
      }

      yield put({ type: 'loading', payload: false });
    }
  },

  reducers: {
    loading(
      state, action
    ) {
      return {
        ...state,
        loading: action.payload
      }
    },
    changeLoginStatus(
      state,
      {
        payload: { status, type, permissions },
      }
    ) {
      if (permissions) {
        setAuthority(permissions);
      }

      return {
        ...state,
        status,
        type,
      };
    },
  },

  subscriptions: {
    activation({ history, dispatch }) {
      return history.listen((location) => {
        if (location.pathname === '/auth/login' && location.query.activateCode) {
          dispatch({
            type: 'activate',
            payload: { activateCode: location.query.activateCode }
          });
          return;
        }

        dispatch({
          type: 'loading',
          payload: false
        });
      })
    }
  }
};
