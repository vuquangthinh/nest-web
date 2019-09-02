import qs from 'qs';
import { privateRequest } from './auth';
import { queryPagination } from './nest';
import { objectAsFormData, removeIfNull } from '@/utils/utils';

export const selection = ({ search }) => privateRequest(`/assets?${qs.stringify({
  filter: {
    q: search,
    limit: 10
  },
})}`);

export const queryAll = async ({ filters, sorts, pagination } = {}) => {
  const query = {
    ...filters,
  };
  return queryPagination('assets', query, sorts, pagination);
}

export const queryOne = ({ id }) => privateRequest(`/assets/${id}`);

export const create = async data => {

  const { assetUrl,
    // preview
  } = data;
  const newData = removeIfNull(data);

  delete newData.assetUrl;
  delete newData.preview;

  const result = await privateRequest(`/assets`, {
    method: 'POST',
    body: newData,
  });

  if (result.success) {
    const { id } = result.data;

    // if (preview) {
      const uploadResult = await privateRequest(`/assets/${id}/content`, {
        method: 'PATCH',
        body: objectAsFormData({
          // preview,
          assetUrl
        })
      });

      return uploadResult;
    // }
  }

  return result;
}


export const update = async ({ id, ...rest }) => {
  const newData = { ...rest };
  const { preview, assetUrl } = newData;

  if (newData.preview instanceof File) {
    delete newData.preview;
  }

  if (newData.assetUrl instanceof File) {
    delete newData.assetUrl;
  }

  const result = await privateRequest(`/assets/${id}`, {
    method: 'PATCH',
    body: removeIfNull(newData)
  });

  if (result.success) {
    if (preview || assetUrl) {
      const uploadResult = await privateRequest(`/assets/${id}/content`, {
        method: 'PATCH',
        body: objectAsFormData({
          preview,
          assetUrl,
        })
      });

      return uploadResult;
    }
  }

  return result;
};

export const remove = ({ id }) =>
  privateRequest(`/assets/${id}`, {
    method: 'DELETE',
  });
