import qs from 'qs';
import { privateRequest } from './auth';
import  { getAuthority } from '@/utils/authority';

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
    result.data = data.filter( role => role.code !== 'super')
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


export const queryOne = ({ id }) => privateRequest(`/roles/${id}`);

