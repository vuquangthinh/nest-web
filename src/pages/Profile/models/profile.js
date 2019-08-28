import { queryBasicProfile, queryAdvancedProfile } from '@/services/api';
import { changePassword } from '@/services/identity';
import { notification } from 'antd';
import { dispatchEventInPayload } from '@/utils/utils';

export default {
  namespace: 'profile',

  state: {
    basicGoods: [],
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
  },

  effects: {
    *fetchBasic(_, { call, put }) {
      const response = yield call(queryBasicProfile);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *fetchAdvanced(_, { call, put }) {
      const response = yield call(queryAdvancedProfile);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *updatePassword({ payload, ...other }, { call }) {
      const response = yield call(changePassword, payload);
      if (response.success) {
        notification.success({
          message: 'Cập nhật thành công',
        });
        return;
      }

      dispatchEventInPayload(response, other);
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
