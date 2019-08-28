import qs from 'qs';
import { privateRequest } from './auth';
import { queryPagination } from './loopback';
import { objectAsFormData, removeIfNull } from '@/utils/utils';
import { STATUS_ACTIVE } from '@/constants';
import  { getAuthority } from '@/utils/authority';


export const selection = ({ search }) =>
  privateRequest(
    `/channels?${qs.stringify({
      filter: {
        // q: search,
        where: {
          name: search
        },
        limit: 10
      },
    })}`
  );

export const selectionActive = ({ search }) =>
privateRequest(
  `/channels?${qs.stringify({
    filter: {
      // q: search,
      where: {
        name: search,
        status: STATUS_ACTIVE,
      },
      limit: 10
    },
  })}`
);

export const queryAll = async ({ filters, sorts, pagination }) => {
  const query = {
    ...filters
  };
  if (getAuthority().includes('publisher')) {
    query.status = STATUS_ACTIVE;
  }

  return queryPagination('channels', query, sorts, pagination);
}

export const queryOne = ({ id }) => privateRequest(`/channels/${id}`);

export const create = async data =>{
  const newData = { ...data };
  const { picture } = newData;
  delete newData.picture;

  const result = await privateRequest(`/channels`, {
    method: 'POST',
    body: removeIfNull(newData),
  });

  if (result.success) {
    if (picture) {
      const {id} = result.data;
      const uploadResult = await privateRequest(`/channels/${id}/picture`, {
        method: 'PATCH',
        body: objectAsFormData({
          picture
        })
      });

      return uploadResult;
    }
  }

  return result;
}

export const update = async ({ id, ...rest }) => {
  const newData = { ...rest };
  const { picture } = newData;

  if (newData.picture instanceof File) {
    delete newData.picture;
  }

  const result = await privateRequest(`/channels/${id}`, {
    method: 'PATCH',
    body: {
      ...removeIfNull(newData),
    },
  });

  if (result.success) {
    if (picture) {
      const uploadResult = await privateRequest(`/channels/${id}/picture`, {
        method: 'PATCH',
        body: objectAsFormData({
          picture
        })
      });

      return uploadResult;
    }
  }

  return result;
}

export const remove = ({ id }) =>
  privateRequest(`/channels/${id}`, {
    method: 'DELETE',
  });
