import { changePassword } from '@/services/identity';
import { notification } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { dispatchEventInPayload } from '@/utils/utils';

export default {
  namespace: 'accountSetting',

  state: {},

  effects: {
    *updatePassword({ payload, ...other }, { call }) {
      const response = yield call(changePassword, payload);

      if (response.success) {
        notification.success({
          message: formatMessage({id: 'common.changePassword.changeSuccess'}),
        });
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        // router.push('/auth/login')
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
