import qs from 'qs';
import { privateRequest } from './auth';
import request from '@/utils/request';

export async function queryPagination(resource, where = {}, sorts = {}, pagination = {}) {

  const newPagination = {
    ...pagination,
    pageSize: pagination.pageSize || 10,
    current: pagination.current || 1,
  };

  const response = await privateRequest(`/${resource}?${qs.stringify({
    per_page: newPagination.pageSize,
    page: newPagination.current,
  })}`, {});

  if (!response.success) {
    return response;
  }

  const result = response.data;

  return {
    success: true,
    data: {
      list: result.data,
      pagination: {
        ...newPagination,
        current: request.page,
        total: request.count,
      },
    },
  };
}

// generate search function from api service
export const createRemote = service => ({ search }) =>
  service({
    filter: {
      q: search,
    },
  });
