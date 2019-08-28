import qs from 'qs';
import toString from 'lodash';
import { privateRequest } from './auth';
import { queryPagination } from './loopback';
import { objectAsFormData, removeIfNull } from '@/utils/utils';
import { STATUS_ACTIVE } from '@/constants';

export const selection = async ({ search }) => {
  const result = await privateRequest(`/users?${qs.stringify({
    filter: {
      q: search,
      limit: 10
    },
  })}`);

  if (result.success) {
    return {
      success: true,
      data: result.data.map(item => {
        const name = [];
        name.push(`[${item.username}]`);
        if (item.firstName && item.lastName) {
          name.push(`${item.firstName} ${item.lastName}`);
        }

        return {
          id: item.id,
          name: name.join(' '),
        };
      })
    };
  }

  return result;
}

export const selectionActive = async ({ search }) => {
  const result = await privateRequest(`/users?${qs.stringify({
    filter: {
      q: search,
      where: {
        status: STATUS_ACTIVE
      },
      limit: 10
    },
  })}`);

  if (result.success) {
    return {
      success: true,
      data: result.data.map(item => {
        const name = [];
        name.push(`[${item.username}]`);
        if (item.firstName && item.lastName) {
          name.push(`${item.firstName} ${item.lastName}`);
        }

        return {
          id: item.id,
          name: name.join(' '),
        };
      })
    };
  }

  return result;
}

export const selectionAdmin = async ({ search, companyId }) => {
  const result = await privateRequest(`/users?${qs.stringify({
    filter: {
      where: {
        status: STATUS_ACTIVE,
        name: search,
        companyId
      },
      limit: 10
    },
  })}`);

  if (result.success) {
    return {
      success: true,
      data: result.data.map(item => {
        const name = [];
        name.push(`[${item.username}]`);
        if (item.firstName && item.lastName) {
          name.push(`${item.firstName} ${item.lastName}`);
        }

        return {
          id: item.id,
          name: name.join(' '),
        };
      })
    };
  }

  return result;
}

export const selectionOne = async ({ id }) => {
  const result = await privateRequest(`/users/${id}`);

  if (result.success) {
    const item = result.data;
    const name = [];
    name.push(`[${item.username}]`);
    if (item.firstName && item.lastName) {
      name.push(`${item.firstName} ${item.lastName}`);
    }

    return {
      success: true,
      data: {
        id: item.id,
        name: name.join(' ')
      }
    };
  }

  return result;
}


export const queryAll = async ({ filters, sorts, pagination }) => {
  const query = {
    ...filters,
  };
  return queryPagination('users', query, sorts, pagination);
};

export const queryOne = ({ id }) => privateRequest(`/users/${id}`);

export const create = async data => {

  const newData = { ...data };
  const { avatar, secondaryEmail } = newData;
  if(secondaryEmail === '') delete newData.secondaryEmail;
  if (avatar instanceof File) {
    delete newData.avatar;
  }

  if (newData.phone) {
    newData.phone = toString(newData.phone).replace(/\s/g, '');
  } else {
    delete newData.phone;
  }
  if (newData.phone === '+') {
    delete newData.phone;
  }

  const username = toString(newData.username).trim();
  const result = await privateRequest(`/users`, {
    method: 'POST',
    body: removeIfNull({
      ...newData,
      username
    }),
  });

  if (result.success) {
    if (avatar instanceof File ) {
      const {id} = result.data;
      const uploadResult = await privateRequest(`/users/${id}/avatar`, {
        method: 'PATCH',
        body: objectAsFormData({
          avatar
        })
      });

      return uploadResult;
    }
  }

  return result;
}

export const update = async ({ id, ...rest }) => {

  const newData = { ...rest };
  const { avatar } = newData;

  if (newData.avatar instanceof File) {
    delete newData.avatar;
  }

  if (newData.phone) {
    newData.phone = toString(newData.phone).replace(/\s/g, '');
  } else {
    newData.phone = '';
  }

  if (newData.phone === '+') {
    newData.phone = '';
  }

  const username = newData.username.trim();

  const result = await privateRequest(`/users/${id}`, {
      method: 'PATCH',
      body: removeIfNull({
        ...newData,
        username
      }),
    });

    if (result.success) {
      if (avatar instanceof File) {
        const uploadResult = await privateRequest(`/users/${id}/avatar`, {
          method: 'PATCH',
          body: objectAsFormData({
            avatar
          })
        });

        return uploadResult;
      }
    }

    return result;
  }


export const remove = ({ id }) =>
  privateRequest(`/users/${id}`, {
    method: 'DELETE',
  }
);

export const changePassword = ({ id }) =>
  privateRequest(`/users/${id}/password`, {
    method: 'PATCH',
  }
);
