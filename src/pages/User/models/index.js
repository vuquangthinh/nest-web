import { notification } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import { queryAll, create, remove, update, queryOne, changePassword } from '@/services/user';
import { dispatchEventInPayload, extractFilterQueryString } from '@/utils/utils';

const model = {
  namespace: 'user',

  state: {
    url: {
      list: '/user'
    },
    params: {
      filters: {},
      sorts: {},
      pagination: {},
    },
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, {
       call, put,
      //  select
      }) {
      const params = {
        filters: {},
        sorts: {},
        pagination: {}
      };
      const newParams = {
        ...params,
        ...payload,
      };

      const { success, data } = yield call(queryAll, newParams);

      if (success) {
        yield put({
          type: 'save',
          payload: {
            params: newParams,
            data,
          },
        });
      }
    },

    *fetchOne({ payload, ...other }, { call }) {
      const response = yield call(queryOne, payload);
      dispatchEventInPayload(response, other);
    },

    *create({ payload, ...other }, { call }) {
      const response = yield call(create, {
        ...payload,
      });

      if (response.success) {
        notification.success({
          message: formatMessage({ id: 'common.notification.createSuccess' }),
        });
      }

      dispatchEventInPayload(response, other);
    },

    *remove({ payload, callback }, { call, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      const { list } = yield select(s => s.user.url);
      router.push(list);
    },

    *changePassword({ payload, callback }, { call, select }) {
      const response = yield call(changePassword, payload);
      if (callback) callback(response);
      const { list } = yield select(s => s.user.url);
      router.push(list);
    },

    *update({ payload, ...other }, { call }) {

      const response = yield call(update, payload);

      if (response.success) {
        notification.success({
          message: formatMessage({ id: 'common.notification.updateSuccess' }),
        });
      }

      dispatchEventInPayload(response, other);
    },
  },

  reducers: {
    url(state, action) {
      return {
        ...state,
        url: {
          ...state.url,
          ...action.payload,
        }
      }
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
        params: action.payload.params,
      };
    },
  },

  subscriptions: {
    setUp({ history, dispatch }) {
      return history.listen(location => {
        if (
          ['/users', '/settings/users'].includes(location.pathname)
        ) {
          // parse jspath to object

          const params = extractFilterQueryString(location.query);

          if (model.state.url.list !== location.pathname) {
            dispatch({
              type: 'url',
              payload: {
                list: location.pathname
              }
            });
          }

          dispatch({
            type: 'fetch',
            payload: {
              ...params,
            },
          });
        }
      });
    },
  },
};

export default model;
