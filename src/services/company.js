import qs from 'qs';
import { privateRequest } from './auth';
import { queryPagination } from './loopback';
import { objectAsFormData, removeIfNull } from '@/utils/utils';
import { STATUS_ACTIVE } from '@/constants';

export const selection = ({ search }) =>
  privateRequest(
    `/companies?${qs.stringify({
      filter: {
        q: search,
        limit: 10
      },
  })}`
);

export const selectionActive = ({ search }) =>
privateRequest(
  `/companies?${qs.stringify({
    filter: {
      q: search,
      where: {
        status: STATUS_ACTIVE
      },
      limit: 10
    },
  })}`
);

export const selectionParent = ({ search, currentId }) => {
  if (currentId) {
    return privateRequest(
      `/companies/${currentId}/parentables?${qs.stringify({
        filter: {
          q: search,
          limit: 10
        },
      })}`
    );
  }

  return privateRequest(
    `/companies?${qs.stringify({
      filter: {
        q: search,
        limit: 10
      },
    })}`
  );
}

export const selectionParentActive = ({ search, currentId }) => {
  if (currentId) {
    return privateRequest(
      `/companies/${currentId}/parentables?${qs.stringify({
        filter: {
          q: search,
          where: {
            status: STATUS_ACTIVE
          },
          limit: 10
        },
      })}`
    );
  }

  return privateRequest(
    `/companies?${qs.stringify({
      filter: {
        q: search,
        where: {
          status: STATUS_ACTIVE
        },
        limit: 10
      },
    })}`
  );
}

export const queryAll = async ({ filters, sorts, pagination }) => {
  const query = {
    ...filters,
  };
  return queryPagination('companies', query, sorts, pagination);
}

export const queryOne = ({ id }) => privateRequest(`/companies/${id}`);

export const create = async data => {
  const newData = { ...data };
  const { picture, contractFile } = newData;

  delete newData.picture;
  delete newData.contractFile;

  const result = await privateRequest(`/companies`, {
    method: 'POST',
    body: removeIfNull(newData),
  });

  if (result.success) {
    if (picture instanceof File) {
      const { id } = result.data;
      const uploadResult = await privateRequest(`/companies/${id}/picture`, {
        method: 'PATCH',
        body: objectAsFormData({
          picture
        })
      });

      if (!uploadResult.success) {
        return uploadResult;
      }
    }

    if (contractFile instanceof File) {
      const { id } = result.data;
      const uploadResult = await privateRequest(`/companies/${id}/contractFile`, {
        method: 'PATCH',
        body: objectAsFormData({
          contractFile
        })
      });

      if (!uploadResult.success) {
        return uploadResult;
      }
    }
  }

  return result;
}

export const update = async ({ id, ...rest }) => {
  const newData = { ...rest };
  const { picture, contractFile } = newData;

  if (picture instanceof File) {
    delete newData.picture;
  }

  if (contractFile instanceof File) {
    delete newData.contractFile;
  }

  const result = await privateRequest(`/companies/${id}`, {
    method: 'PATCH',
    body: removeIfNull(newData),
  });

  if (result.success) {
    if (picture instanceof File) {
      const uploadResult = await privateRequest(`/companies/${id}/picture`, {
        method: 'PATCH',
        body: objectAsFormData({
          picture
        })
      });

      if (!uploadResult.success) {
        return uploadResult;
      }
    }

    if (contractFile instanceof File) {
      const uploadResult = await privateRequest(`/companies/${id}/contractFile`, {
        method: 'PATCH',
        body: objectAsFormData({
          contractFile
        })
      });

      if (!uploadResult.success) {
        return uploadResult;
      }
    }
  }

  return result;
}

export const remove = ({ id }) =>
  privateRequest(`/companies/${id}`, {
    method: 'DELETE',
});
