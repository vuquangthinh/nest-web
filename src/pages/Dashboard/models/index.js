import { getAuthority } from '@/utils/authority';
import router from 'umi/router';

export default {
  namespace: 'dashboard',

  state: {
  },

  effects: {
    init() {
      // check permissions
      const authority = getAuthority();

      if (authority.includes('admin')) {
        router.push('/stories');
        return;
      }

      if (authority.includes('super')) {
        router.push('/stories');
        return;
      }

      if (authority.includes('publisher')) {
        router.push('/studio/stories');
      }
    }
  },

  reducers: {
  },

  subscriptions: {
    setUp({ history, dispatch }) {
      return history.listen((location) => {
        if (location.pathname === '/') {
          dispatch({
            type: 'init'
          });
        }
      });
    }
  }
};
