import { queryCurrent, updateUser } from '@/services/identity';
import { dispatchEventInPayload } from '@/utils/utils';

export default {
  namespace: 'identity',

  state: {
    identity: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },

    *update({ payload, ...other }, { call, put }) {
      const response = yield call(updateUser, payload);
      if (response) {
        if (response.success) {
          yield put({
            type: 'save',
            payload: response.data,
          });
        }

        dispatchEventInPayload(response, other);
      }
    },
  },

  reducers: {
    save(state, action) {
      if (action.payload) {
        return {
          ...action.payload,
        };
      }

      return null;
    },
  },
};
