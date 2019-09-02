import qs from 'qs';
import { privateRequest } from './auth';
import { getAuthority } from '@/utils/authority';
import { queryPagination } from './nest';

// eslint-disable-next-line import/prefer-default-export
export const selection = async ({ search }) => {
  const authority = getAuthority();
  if (authority.includes('admin')) {
    const result = await privateRequest(
      `/roles?${qs.stringify({
        filter: {
          q: search,
          limit: 10
        },
      })}`
    );

    const { data } = result
    result.data = data.filter(role => role.code !== 'super')
    return result;
  }

  const result = await privateRequest(
    `/roles?${qs.stringify({
      filter: {
        q: search,
        limit: 10
      },
    })}`
  );

  return result;
}

export const queryOne = ({ id }) => privateRequest(`/permissions/${id}`);

export const queryAll = async ({ filters, sorts, pagination }) => {
  const query = {
    ...filters,
  };
  return queryPagination('permissions', query, sorts, pagination);
}