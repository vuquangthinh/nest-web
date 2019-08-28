import moment from 'moment';
import defaultSettings from '@/defaultSettings';

export default {
  namespace: 'global',

  state: {
    collapsed: true, // defaultSettings.alwayCollapsedSidebar,
    notices: [],

    application: {
      name: 'ZMOOZ',
      headerName: 'ZMOOZ.',
      description: 'Superadmin Dashboard',
      copyright: 'zmooz',
      year: moment().format('Y'),
      forgotLink: 'https://agiltech.vn/forgot',
    },
  },

  effects: {
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      if (defaultSettings.alwayCollapsedSidebar) {
        return state;
      }

      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }

        // enable setting
      });
    },
  },
};
