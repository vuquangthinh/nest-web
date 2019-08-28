import { notification } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import pluralize from 'pluralize';
import { dispatchEventInPayload, extractFilterQueryString } from '@/utils/utils';

export default function build(
  namespace,
  { url, listUrls, queryAll, queryOne, create, remove, update }
) {
  const model = {
    namespace,

    state: {
      url: {
        list: `/${pluralize(namespace)}`,
        ...url,
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
      *fetch(
        { payload },
        {
          call,
          put,
          //  select
        }
      ) {
        if (!queryAll) return;

        const params = {
          filters: {},
          sorts: {},
          pagination: {},
        };
        // const { params } = yield select(state => state[model.namespace]);
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
        if (!queryOne) return;

        const response = yield call(queryOne, payload);
        dispatchEventInPayload(response, other);
      },

      *create({ payload, ...other }, { call }) {
        if (!create) return;

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
        if (!remove) return;

        const response = yield call(remove, payload);
        if (callback) callback(response);
        const { list } = yield select(s => s[namespace].url);
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
          },
        };
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
        const urls = [...listUrls, model.state.url.list];
        return history.listen(location => {
          if (urls.includes(location.pathname)) {
            // parse jspath to object

            const params = extractFilterQueryString(location.query);

            if (model.state.url.list !== location.pathname) {
              dispatch({
                type: 'url',
                payload: {
                  list: location.pathname,
                },
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

  return model;
}
