import qs from 'qs';
import { privateRequest } from './auth';
import { queryPagination } from './loopback';
import { removeIfNull } from '@/utils/utils';
import { STATUS_ACTIVE } from '@/constants';

export const selection = ({ search }) =>
  privateRequest(
    `/countries?${qs.stringify({
      filter: {
        q: search,
        limit: 10
      },
    })}`
  );

export const selectionActive = ({ search }) =>
  privateRequest(
    `/countries?${qs.stringify({
      filter: {
        q: search,
        where: {
          status: STATUS_ACTIVE,
        },
        limit: 10
      },
    })}`
  );

  export const queryAll = async ({ filters, sorts, pagination }) => {
    const query = {
      ...filters,
    };
    return queryPagination('countries', query, sorts, pagination);
  }

  export const queryOne = ({ id }) => privateRequest(`/countries/${id}`);

  export const create = data =>
    privateRequest(`/countries`, {
      method: 'POST',
      body: removeIfNull(data),
    });

  export const update = ({ id, ...rest }) =>
    privateRequest(`/countries/${id}`, {
      method: 'PATCH',
      body: removeIfNull(rest),
    });

  export const remove = ({ id }) =>
    privateRequest(`/countries/${id}`, {
      method: 'DELETE',
    });


