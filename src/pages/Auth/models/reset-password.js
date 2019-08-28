import { requestForgotPassword, requestChangePasswordByToken, requestValidatePasswordByToken } from "@/services/auth";
import { dispatchEventInPayload } from "@/utils/utils";


export default {
  namespace: 'reset-password',

  state: {
  },

  effects: {
    *request({ payload, ...rest }, { call }) {
      const result = yield call(requestForgotPassword,payload);
      dispatchEventInPayload(result, rest);
    },

    *change({ payload, ...rest }, { call }) {
      const result = yield call(requestChangePasswordByToken,payload);
      dispatchEventInPayload(result, rest);
    },

    *validate({ payload, ...rest }, { call }) {
      const result = yield call(requestValidatePasswordByToken,payload);
      dispatchEventInPayload(result, rest);
    },
  },

  reducers: {
  },
}
