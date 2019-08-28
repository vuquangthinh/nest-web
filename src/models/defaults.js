import jwtDecode from 'jwt-decode';
import { getAccessToken } from "@/services/auth";

export default {
  namespace: 'defaults',

  state: {
    defaultChannel: null,
    defaultStoryLibrary: null,
    defaultAssetLibrary: null
  },

  effects: {
    *update({ payload }, { put }) {

      let newPayload = payload;
      if (!payload) {
        newPayload = jwtDecode(getAccessToken());
      }

      const { data } = newPayload;

      const fields = ['defaultChannel', 'defaultStoryLibrary', 'defaultAssetLibrary'];

      const patch = fields.reduce((r, v) => {
        if (data[v]) {
          return {
            ...r,
            [v]: data[v]
          };
        }

        return r;
      }, {});

      // default value in company
      const patchOveride = fields.reduce((r, v) => {
        if (patch[v]) return r;
        if (data.company && data.company[v]) {
          return {
            ...r,
            [v]: data.company[v]
          }
        }

        return r;
      }, patch);
      yield put({
        type: 'patch',
        payload: patchOveride
      });
    }
  },

  reducers: {
    patch: (state, action) => ({
      ...state,
      ...action.payload
    })
  }
}
