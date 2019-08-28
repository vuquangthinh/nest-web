import { queryAll } from '@/services/constant';

const IsPackage = [
  {
    id: 0,
    title: "IsPackage.NO"
  },
  {
    id: 1,
    title: "IsPackage.YES"
  }
];

export default {
  namespace: 'constant',
  state: {
    IsPackage
  },

  effects: {
    *fetch(_, { call, put }) {
      const { success, data } = yield call(queryAll);

      if (success) {
        yield put({
          type: 'save',
          payload: {
            ...data,
            IsPackage
          },
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
