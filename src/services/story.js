import qs from 'qs';
import { privateRequest } from './auth';
import { queryPagination } from './loopback';
import { objectAsFormData, removeIfNull } from '@/utils/utils';
// import { objectAsFormData } from '@/utils/utils';

export const selection = async ({ search }) => {
  const result = await privateRequest(`/stories?${qs.stringify({
    filter: {
      q: search,
      limit: 10
    },
  })}`);
  if (result.success) {
    return {
      success: true,
      data: result.data.map(item => {
        return {
          id: item.id,
          name: item.title,
        };
      })
    };
  }
  return result;
}

export const shareStories = async ({ id }) => {
  const result = await privateRequest(`/portal/stories/${id}/share`);
  return result;
}

export const selectionOne = async ({ id }) => {
  const result = await privateRequest(`/stories/${id}`);
  if (result.success) {
    const item = result.data;
    const name = [];
    name.push(`[${item.username}]`);
    return {
      success: true,
      data: {
        id: item.id,
        name: item.title
      }
    };
  }

  return result;
}


export const queryAll = async ({ filters, sorts, pagination }) => {
  const query = {
    ...filters,
  };
  return queryPagination('stories', query, sorts, pagination);
};

export const queryOne = ({ id }) => privateRequest(`/stories/${id}`);

export const create = async data => {
  const newData = { ...data };
  const { cover } = newData;
  delete newData.cover;

  const result = await privateRequest(`/stories`, {
    method: 'POST',
    body: removeIfNull(newData),
  });

  if (result.success) {
    if (cover instanceof File) {
      const { id } = result.data;
      const uploadResult = await privateRequest(`/stories/${id}/cover`, {
        method: 'PATCH',
        body: objectAsFormData({
          cover
        })
      });

      return uploadResult;
    }
  }
  return result;
}

export const update = async ({ id, ...rest }) => {
  const newData = { ...rest };
  const { cover } = newData;

  if (newData.cover instanceof File) {
    delete newData.cover;
  }

  const result = await privateRequest(`/stories/${id}`, {
    method: 'PATCH',
    body: removeIfNull(newData),
  });

  if (result.success) {
    if (cover) {
      const uploadResult = await privateRequest(`/stories/${id}/cover`, {
        method: 'PATCH',
        body: objectAsFormData({
          cover
        })
      });

      return uploadResult;
    }
  }

  return result;
}


export const remove = ({ id }) =>
  privateRequest(`/stories/${id}`, {
    method: 'DELETE',
});

export const clone = ({ id }) =>
  privateRequest(`/stories/${id}/duplicate`, {
    method: 'GET',
});


export const fetchView = ({ id }) => privateRequest(`/stories/${id}/content`, {
  method: 'GET'
});
