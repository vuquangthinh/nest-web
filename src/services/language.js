import qs from 'qs';
import { privateRequest } from './auth';
import { queryPagination } from './nest';
import { removeIfNull } from '@/utils/utils';
import { STATUS_ACTIVE } from '@/constants';

export const selection = ({search}) => privateRequest(`/languages?${qs.stringify({
  filter: {
    q: search,
    limit: 10
  },
})}`);

export const selectionActive = ({search}) => privateRequest(`/languages?${qs.stringify({
  filter: {
    q: search,
    where: {
      status: STATUS_ACTIVE,
    },
    limit: 10
  },
})}`);

export const queryAll = async ({ filters, sorts, pagination }) => {
  const query = {
    ...filters,
  };
  return queryPagination('languages', query, sorts, pagination);
}

export const queryOne = ({ id }) => privateRequest(`/languages/${id}`);

export const create = data =>
  privateRequest(`/languages`, {
    method: 'POST',
    body: removeIfNull(data),
  });

export const update = ({ id, ...rest }) =>
  privateRequest(`/languages/${id}`, {
    method: 'PATCH',
    body: removeIfNull(rest),
  });

export const remove = ({ id }) =>
  privateRequest(`/languages/${id}`, {
    method: 'DELETE',
  });

