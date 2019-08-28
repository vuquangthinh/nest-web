import { queryAll, create, remove, update, queryOne, clone } from '@/services/story';
import { notification } from 'antd';
// import _ from 'lodash';
import { dispatchEventInPayload, extractFilterQueryString } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import pluralize from 'pluralize';
import router from 'umi/router';

const namespace = 'story';

export default {
  namespace,

  state: {
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
     // const { params } = yield select(state => state[namespace]);
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

    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      router.push('/stories')
    },

    *clone({ payload, callback }, { call }) {
      const response = yield call(clone, payload);
      if (callback) callback(response);
      router.push('/stories')
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
        if (location.pathname === `/${pluralize.plural(namespace)}`) {
          // parse jspath to object

          const params = extractFilterQueryString(location.query);

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
