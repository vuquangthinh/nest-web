import qs from 'qs';
import { privateRequest } from './auth';
import { queryPagination } from './nest';
import { objectAsFormData, removeIfNull } from '@/utils/utils';
import { getAuthority } from '@/utils/authority';
import { STATUS_ACTIVE } from '@/constants';

const CATALOG_STORY = 1;
const CATALOG_ASSET = 0;


export const selection = ({ search }) =>
  privateRequest(
    `/catalogs?${qs.stringify({
      filter: {
        where: {
          name: search,
        },
        limit: 10,
      },
    })}`
  );

export const selectionType = ({ search }) =>
  privateRequest(
    `/catalogs?${qs.stringify({
      filter: {
        where: {
          name: search,
          catalogType: CATALOG_STORY,
        },
        limit: 10,
      },
    })}`
  );

export const selectionActive = ({ search }) =>
  privateRequest(
    `/catalogs?${qs.stringify({
      filter: {
        q: search,
        where: {
          status: STATUS_ACTIVE,
        },
        limit: 10,
      },
    })}`
  );


export const selectionStoryActiveWithCom = ({ search, companyId }) =>
  privateRequest(
    `/catalogs?${qs.stringify({
      filter: {
        q: search,
        where: {
          status: STATUS_ACTIVE,
          catalogType: CATALOG_STORY,
          inCompanyId: companyId,
        },
        limit: 10,
      },
    })}`
  );

export const selectionAssetActiveWithCom = ({ search, companyId }) =>
  privateRequest(
    `/catalogs?${qs.stringify({
      filter: {
        q: search,
        where: {
          status: STATUS_ACTIVE,
          catalogType: CATALOG_ASSET,
          inCompanyId: companyId,
        },
        limit: 10,
      },
    })}`
  );

export const selectionActiveWithCom = ({ search, companyId }) => {
  return privateRequest(
    `/catalogs?${qs.stringify({
      filter: {
        q: search,
        where: {
          status: STATUS_ACTIVE,
          inCompanyId: companyId,
        },
        limit: 10,
      },
    })}`
  );
};

export const selectionParent = ({ search, currentId }) => {
  if (currentId) {
    return privateRequest(
      `/catalogs/${currentId}/parentables?${qs.stringify({
        filter: {
          where: {
            name: search,
          },
          limit: 10,
        },
      })}`
    );
  }

  return privateRequest(
    `/catalogs?${qs.stringify({
      filter: {
        q: search,
        limit: 10,
      },
    })}`
  );
};

export const selectionParentActive = ({ search, currentId }) => {
  if (currentId) {
    return privateRequest(
      `/catalogs/${currentId}/parentables?${qs.stringify({
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
    `/catalogs?${qs.stringify({
      filter: {
        q: search,
        where: {
          status: STATUS_ACTIVE,
        },
        limit: 10,
      },
    })}`
  );
};

export const queryAll = async ({ filters, sorts, pagination }) => {
  const query = {
    ...filters,
  };
  if (getAuthority().includes('publisher')) {
    query.status = STATUS_ACTIVE;
  }
  return queryPagination('catalogs', query, sorts, pagination);
};

export const queryOne = ({ id }) => privateRequest(`/catalogs/${id}`);

export const create = async data => {
  const newData = { ...data };
  const { cover } = newData;
  delete newData.cover;

  const result = await privateRequest(`/catalogs`, {
    method: 'POST',
    body: removeIfNull(newData),
  });

  if (result.success) {
    if (cover) {
      const { id } = result.data;
      const uploadResult = await privateRequest(`/catalogs/${id}/cover`, {
        method: 'PATCH',
        body: objectAsFormData({
          cover,
        }),
      });

      return uploadResult;
    }
  }

  return result;
};

export const update = async ({ id, ...rest }) => {
  const newData = { ...rest };
  const { cover } = newData;

  if (newData.cover instanceof File) {
    delete newData.cover;
  }

  const result = await privateRequest(`/catalogs/${id}`, {
    method: 'PATCH',
    body: {
      ...removeIfNull(newData),
      parentId: rest.parentId || 0,
    },
  });

  if (result.success) {
    if (cover) {
      const uploadResult = await privateRequest(`/catalogs/${id}/cover`, {
        method: 'PATCH',
        body: objectAsFormData({
          cover,
        }),
      });

      return uploadResult;
    }
  }

  return result;
};

export const remove = ({ id }) =>
  privateRequest(`/catalogs/${id}`, {
    method: 'DELETE',
  });
