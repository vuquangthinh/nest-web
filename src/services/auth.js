import jwtDecode from 'jwt-decode';
import TokenManagement from 'token-management';
import _ from 'lodash';
import request from '@/utils/request';
import { invokeRequest } from './request';
// import { PathUtil } from '@antv/g2/src';

function isRememberMe() {
  return localStorage.getItem('rememberMe') === 'yes';
}

function setIsRememberMe(check) {
  localStorage.setItem('rememberMe', check ? 'yes' : 'no');
}

function getStorage() {
  if (isRememberMe()) {
    return localStorage;
  }

  return sessionStorage;
}

export const getAccessToken = () => getStorage().getItem('accessToken');
export const setAccessToken = token => {
  if (token) {
    getStorage().setItem('accessToken', token);
    return;
  }

  getStorage().removeItem('accessToken');
};

export const getRefreshToken = () => getStorage().getItem('refreshToken');
export const setRefreshToken = token => {
  if (token) {
    getStorage().setItem('refreshToken', token);
    return;
  }

  getStorage().removeItem('refreshToken');
};

// install token management,
const tk = new TokenManagement({
  isTokenValid(token) {
    try {
      const payload = jwtDecode(token);
      if (Date.now() / 1000 < payload.exp - 20) {
        return true;
      }
    } catch (e) {
      //
    }

    return false;
  },
  getAccessToken: () => localStorage.getItem('accessToken'),
  onRefreshToken(done) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      done(null);
      return;
    }

    invokeRequest('post', '/auth/refresh', {
      refreshToken,
    })
      .then(result => {
        if (result.success) {
          const { accessToken, refreshToken } = result.data;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          done(accessToken);
          return;
        }

        setAccessToken(null);
        setRefreshToken(null);
        done(null);
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error('err on refresh', e);
        done(null);
      });
  },
});

export async function privateRequest(path, options, showErrorNotification = true) {
  const token = await tk.getToken();

  if (!token) {
    // forward to login
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'login/logout',
    });

    // invalid token, so request fail
    return {
      success: false,
      data: {},
    };
  }

  return request(
    path,
    {
      ...options,
      headers: {
        ..._.get(options, 'headers', {}),
        Authorization: `Bearer ${token}`,
      },
    },
    showErrorNotification
  );
}

export async function saveTokens(response) {
  const { accessToken, refreshToken } = response.data;
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);

  // decode jwt
  const payload = jwtDecode(accessToken);

  // eslint-disable-next-line
  console.log('set token is done, update roles', payload);

  const permissions = new Set();
  permissions.add('@');

  if (payload.roles) {
    payload.roles.forEach(perm => {
      permissions.add(perm);
    });
  }

  return {
    success: true,
    ...response,
    permissions: Array.from(permissions),
    decoded: payload
  };
}

export async function login({ username, password, rememberMe }) {
  setIsRememberMe(rememberMe);

  const response = await invokeRequest('post', '/auth/basic', {
    username,
    password,
  });

  if (!response.success) {
    return response;
  }

  return saveTokens(response);
}

export async function logout() {
  const token = getRefreshToken();
  if (token) {
    try {
      await request('/auth/logout', {
        method: 'POST',
        body: {
          refreshToken: getRefreshToken(),
        },
      });
    } catch (e) {
      // ignore
      console.log(e); // eslint-disable-line
    }

    setRefreshToken(null);
    setAccessToken(null);
  }

  return null;
}

export const injectToken = service => tk.inject(service);




// OTHER SERVICE

export const requestForgotPassword = ({ identity }) => request('/auth/basic/request-forgot', {
  method: 'POST',
  body: { identity }
});

export const requestChangePasswordByToken = ({ token, password }) => request('/auth/basic/request-forgot/email-verification', {
  method: 'POST',
  body: { token, password }
});

export const requestValidatePasswordByToken = ({ token, password }) => request('/auth/basic/request-forgot/validation', {
  method: 'POST',
  body: { token, password }
});


export const requestActivateByToken = (token) => request('/auth/basic/register/email/confirmation', {
  method: 'POST',
  body: {
    token
  }
})
