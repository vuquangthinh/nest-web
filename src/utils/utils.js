import moment from 'moment';
import nzh from 'nzh/cn';
import { formatMessage } from 'umi/locale';
import { parse, stringify } from 'qs';
import router from 'umi/router';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}


export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

// set custom validation message
export function setValidateMessage(form, errors) {

  const fieldsValue = form.getFieldsValue();

  const initFields = Object.keys(errors).reduce((r, field) => ({
      ...r,
      [field]: errors[field] ? errors[field].map(msg => new Error(msg)) : []
    }), {});


  const updateFields = Object.keys(fieldsValue).reduce((fields, field) => {
    if (errors[field] && errors[field].length > 0) {
      return {
        ...fields,
        [field]: {
          value: fieldsValue[field],
          errors: errors[field].map(msg => new Error(msg))
        }
      };
    }

    return {
      ...fields,
      [field]: {
        value: fieldsValue[field],
      }
    };
  }, initFields);

  form.setFields(updateFields);
}

export function createValidationCallback(form) {
  return function _setValidateMessage(errors) {
    setValidateMessage(form, errors);
  };
}

export function dispatchEventInPayload(response, payload) {
  const { onValidationFailure, onSuccess, onFail } = payload;
  const { code, data } = response;

  if (code === 422) {
    if (onValidationFailure) onValidationFailure(data, response);
    if (onFail) onFail(response);
    return;
  }

  if (code === 200) {
    if (onSuccess) onSuccess(response.data);
    return;
  }

  if (onFail) onFail(response);
}

// convert object json to formData
export function objectAsFormData(obj) {
  const formData = new FormData();
  Object.keys(obj).filter(name => obj[name] !== undefined).forEach(name => formData.append(name, obj[name]));
  return formData;
}

export function asAsync(callback, ...args) {
  return new Promise((resolve, reject) => {
    callback(...args, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

export function objectToArray(obj, key, value) {
  return Object.keys(obj).map(k => ({
    [key]: k,
    [value]: obj[k],
  }));
}

export function getBase64(file, includeMime = false) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (includeMime) {
        const encoded = reader.result;
        resolve(encoded);
        return;
      }

      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
      if (encoded.length % 4 > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}



export function getConstantTitle(items, code, defaultValue = '') {
  const res = items.find(x => x.id === code);
  if (!res) {
    return defaultValue;
  }

  return formatMessage({ id:  res.title });
}


export function removeIfNull(data) {
  return Object.keys(data).reduce((r, field) => {

    if (data[field] === null) {
      return r;
    }

    if (data[field] === undefined) {
      return r;
    }

    return {
      ...r,
      [field]: data[field]
    };
  }, {});
}

export const extractFilterQueryString = query => Object.keys(query).reduce((res, field) => {
  const [part, ...data] = field.split('.');
  if (!res[part]) res[part] = {};
  res[part][data.join('.')] = query[field];
  return res;
}, {});

// remove all old sort
export const clearSortParams = query => Object.keys(query).reduce((res, field) => {
  if (field.startsWith('sorts.')) {
    return res;
  }

  return {
    ...res,
    [field]: query[field]
  }
}, {});

export const renderEmptyIfInvalidDate = (time, format) => {
  const mTime = moment(time);
  return mTime.isValid() ? mTime.format(format) : '';
}


export const serviceWithEmpty = service => async (...args) => {
  const result = await service(...args)
  if(result.success) {
    return {
      ...result,
      data: [
        { id: 0, username: 'None' },
        ...result.data,
      ]
    };
  }
  return result;
}

export const selectionWithNone = (service, currentId, noneItem = { id: 0, name: 'None' }) => async search => {

  if (search.search) {
    const result = await service({...search, currentId })
    if(result.success) {
      return {
        ...result,
        data: [
          noneItem,
          ...result.data,
        ]
      };
    }
    return result;
  }

  return {
    success: true,
    data: [
      noneItem,
    ]
  }
}


export const createHandleStandardTableChange = ({ location }) => (pagination = { current: 1 }, filtersArg = {}, sorter = {}) => {
    const newQuery = clearSortParams({
      ...location.query
    });

    Object.keys(filtersArg).forEach(field => {
      const key = `filters.${field}`;
      newQuery[key] = filtersArg[field];
    });

    Object.keys(pagination).forEach(field => {
      const key = `pagination.${field}`;

      if (['pageSize', 'current'].includes(field)) {
        newQuery[key] = pagination[field];
      }
    });

    if (sorter.field) {
      const key = `sorts.${sorter.field}`;
      newQuery[key] = sorter.order.toLowerCase() === 'ascend' ? 1 : -1;
    }

    router.push({
      pathname: location.pathname,
      query: newQuery,
    });
  };
