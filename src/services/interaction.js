import qs from 'qs';
import { privateRequest } from './auth';
import { queryPagination } from './nest';
import { STATUS_ACTIVE, DISPLAY_YES } from '@/constants';
import { objectAsFormData, removeIfNull } from '@/utils/utils';

import { InteractionType} from '@/constants';

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
  return queryPagination('interactions', query, sorts, pagination);
}

export const queryOne = ({ id }) => privateRequest(`/interactions/${id}`);


// from code to name
const types = Object.keys(InteractionType).reduce((r, type) => ({
  ...r,
  [InteractionType[type]]: type.toLowerCase(),
}), {});

export const create = async data => {
  const { type } = data;

  if (!types[type]) {
    throw new Error('invalid type');
  }

  const result = await privateRequest(`/interactions/${types[type]}`, {
    method: 'POST',
    body: removeIfNull(data)
  });

  return result;
}

export const update = async ({ id, ...rest }) => {
  const newData = { ...rest };

  const result = await privateRequest(`/interactions/${id}`, {
    method: 'PATCH',
    body: {
      ...removeIfNull(newData),
      receiveDailyReport: !!newData.receiveDailyReport
    },
  });

  // if (result.success) {
  //   if (picture) {
  //     const uploadResult = await privateRequest(`/categories/${id}/picture`, {
  //       method: 'PATCH',
  //       body: objectAsFormData({
  //         picture
  //       })
  //     });

  //     return uploadResult;
  //   }
  // }

  return result;
}

export const remove = ({ id }) =>
  privateRequest(`/interactions/${id}`, {
    method: 'DELETE',
  });
