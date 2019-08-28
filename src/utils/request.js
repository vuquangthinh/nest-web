import fetch from 'dva/fetch';
import { notification } from 'antd';
import router from 'umi/router';
import _ from 'lodash';
import qs from 'qs';
import { formatMessage } from 'umi/locale';
import { isAntdPro } from './utils';
import { API_URL } from '@/constants';

const codeMessage = {
  200: 'OK',
  get 201(){ return formatMessage({ id: 'request.status.201' }) },
  get 202() { return formatMessage({ id: 'request.status.202' }) },
  204: '204',
  get 400() { return formatMessage({ id: 'request.status.400' }) },
  get 401() { return formatMessage({ id: 'request.status.401' }) },
  get 403() { return formatMessage({ id: 'request.status.403' }) },
  get 404() { return formatMessage({ id: 'request.status.404' }) },
  get 406() { return formatMessage({ id: 'request.status.406' }) },
  get 410() { return formatMessage({ id: 'request.status.410' }) },
  // 422: 'Dữ liệu gửi lên không đúng',
  get 500() { return formatMessage({ id: 'request.status.500' }) },
  502: 'Bad gateway',
  503: 'Code 503',
  504: 'Timeout',
};

const entityErrorFormatter = details => _.reduce(details, (result, item) => {
    const newResult = { ...result };
    if (item.code === 'required') {
      const field = [item.path, _.get(item, 'info.missingProperty')].join('.').replace(/^\.+/, '');
      const messages = _.get(newResult, field, []);
      _.set(newResult, field, [
        ...messages,
        item.message
      ]);
    }

    if (item.code === 'type') {
      const field = [item.path].join('.').replace(/^\.+/, '');
      const messages = _.get(newResult, field, []);
      _.set(newResult, field, [
        ...messages,
        item.message
      ]);
    }

    if (item.code === 'format') {
      const field = [item.path].join('.').replace(/^\.+/, '');
      const messages = _.get(newResult, field, []);
      _.set(newResult, field, [
        ...messages,
        item.message
      ]);
    }

    return newResult;
  }, {})

function validateFormatTranformation({error}) {

  const { name } = error;
  if (name === 'UnprocessableEntityError') {
    const { details } = error;
    return entityErrorFormatter(details);
  }

  if (name === 'ValidationError') {
    return _.reduce(_.get(error, 'details.messages', {}), (result, value, key) => ({
        ...result,
        [key]: value
      }), {});
  }

  if (name === 'CustomValidationError') {
    return _.reduce(_.get(error, 'details', []), (result, value) => {
      if (result[value.path]) {
        result[value.path].push(value.message);
        return result;
      }

      return {
        ...result,
        [value.path]: [value.message]
      }
    }, {});
  }

  return {}; // normalize to key => value
}

const checkStatus = newOptions => async response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // body error ?
  let errortext = codeMessage[response.status] || response.statusText;
  let json = '';
  if (newOptions.method !== 'DELETE' && response.status !== 204) {
    const body = await response.json();

    // ignore
    errortext = body.message;
    json = body;
  }

  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  error.json = json;

  // console.log('respxzz',response.status, typeof response.status, await response.json());

  // if (response.status === 422) {
  //   error.errors = await response.json();
  // }

  throw error;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} path       The URL we want to request
 * @param  {object} [_option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(path, _option, showErrorNotification = true) {
  const baseUrl = API_URL;

  const { query, ...option } = _option;

  const url = (() => {
    const newQuery = query
      ? Object.keys(query).reduce((ret, field) => {
          if (query[field] === undefined) {
            return ret;
          }

          return {
            ...ret,
            [field]: query[field],
          };
        }, {})
      : {};
    if (Object.keys(newQuery).length) {
      const concat = baseUrl.indexOf('?') > -1 || path.indexOf('?') > -1 ? '&' : '?';
      return baseUrl + path + concat + qs.stringify(newQuery);
    }

    return baseUrl + path;
  })();

  const options = {
    expirys: isAntdPro(),
    ...option,
  };

  const defaultOptions = {
    // credentials: 'include',
  };

  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PATCH' ||
    newOptions.method === 'PATCH' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  const requestFetch = () =>
    new Promise(resolve => {
      fetch(url, newOptions)
        .then(checkStatus(newOptions))
        // .then(response => cachedSave(response, hashcode))
        .then(response => {
          // DELETE and 204 do not return data by default
          // using .json will report an error.
          if (newOptions.method === 'DELETE' || response.status === 204) {
            return response.text();
          }
          return response.json();
        })
        .then(data => {
          resolve({
            success: true,
            code: 200,
            data,
          });
        })
        .catch(e => {
          const status = e.name;

          if (showErrorNotification) {
            const { response } = e;
            if (response) {
              if (codeMessage[response.status]) {
                notification.error({
                  message: `Lỗi: ${response.status}: ${response.url}`,
                  description: e.message,
                });
              }
            }
          }

          if (status === 401) {
            // @HACK
            /* eslint-disable no-underscore-dangle */
            window.g_app._store.dispatch({
              type: 'login/logout',
            });
            resolve({
              success: false,
              code: status,
              data: e,
            });
            return;
          }

          if (status === 410) {
            resolve({
              success: false,
              code: status,
              data: e,
            });
            return;
          }

          // environment should not be used
          if (status === 403) {
            router.push('/exception/403');
            resolve({
              success: false,
              code: status,
              data: e,
            });
            return;
          }

          if (status <= 504 && status >= 500) {
            router.push('/exception/500');
            resolve({
              success: false,
              code: status,
              data: e,
            });
            return;
          }
          if (status >= 404 && status < 422) {
            router.push('/exception/404');
          }

          // validate
          if (status === 422) {
            // normalize
            resolve({
              success: false,
              code: status,
              message: e.json.error.message || '',
              data: validateFormatTranformation(e.json)
            });

            return;
          }

          resolve({
            success: false,
            code: status,
            data: {},
          });
        });
    });

  return requestFetch();
}
