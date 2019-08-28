import qs from 'qs';
import { privateRequest } from './auth';
import { queryPagination } from './loopback';
import { STATUS_ACTIVE, DISPLAY_YES } from '@/constants';
import { objectAsFormData, removeIfNull } from '@/utils/utils';

export const selection = ({ search }) =>
  privateRequest(
    `/categories?${qs.stringify({
      filter: {
        q: search,
        limit: 10
      },
    })}`
  );

  export const selectionActive = ({ search }) =>
  privateRequest(
    `/categories?${qs.stringify({
      filter: {
        q: search,
        where: {
          status: STATUS_ACTIVE,
          display: DISPLAY_YES,
        },
        limit: 10
      },
    })}`
  );

export const selectionParent = ({ search, currentId }) => {
  if (currentId) {
    return privateRequest(
      `/categories/${currentId}/parentables?${qs.stringify({
        filter: {
          where: {
            name: search
          },
          limit: 10,
        },
      })}`
    );
  }
  return privateRequest(
    `/categories?${qs.stringify({
      filter: {
        q: search,
        limit: 10,
      },
    })}`
  );
}

export const selectionParentActive = ({ search, currentId }) => {
  if (currentId) {
    return privateRequest(
      `/categories/${currentId}/parentables?${qs.stringify({
        filter: {
          where: {
            name: search,
            status: STATUS_ACTIVE,
          },
          limit: 10,
        },
      })}`
    );
  }
  return privateRequest(
    `/categories?${qs.stringify({
      filter: {
        q: search,
        limit: 10,
      },
    })}`
  );
}



export const queryAll = async ({ filters, sorts, pagination }) => {
  const query = {
    ...filters,
  };
  return queryPagination('categories', query, sorts, pagination);
}

export const queryOne = ({ id }) => privateRequest(`/categories/${id}`);

export const create = async data =>{
  const newData = { ...data };
  const { picture } = newData;
  delete newData.picture;

  const result = await privateRequest(`/categories`, {
    method: 'POST',
    body: removeIfNull(newData),
  });

  if (result.success) {
    if (picture) {
      const {id} = result.data;
      const uploadResult = await privateRequest(`/categories/${id}/picture`, {
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

  const result = await privateRequest(`/categories/${id}`, {
    method: 'PATCH',
    body: {
      ...removeIfNull(newData),
      parentId: rest.parentId || 0
    },
  });

  if (result.success) {
    if (picture) {
      const uploadResult = await privateRequest(`/categories/${id}/picture`, {
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
  privateRequest(`/categories/${id}`, {
    method: 'DELETE',
  });
