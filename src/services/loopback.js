import qs from 'qs';
import { privateRequest } from './auth';

export async function queryPagination(resource, where = {}, sorts = {}, pagination = {}) {
  // build query from condition
  const criterial = {
    ...where,
  };
  delete criterial.q;

  const filterQuery = {
    filter: {
      q: where.q || '',
      where: criterial,
      order: [],
      limit: 10,
      offset: 0,
    },
  };

  const requestTotal = await privateRequest(
    `/${resource}/count?${qs.stringify(filterQuery)}`
  );

  if (!requestTotal.success) {
    return requestTotal;
  }

  // sort
  Object.keys(sorts).forEach(field => {
    if (sorts[field] > 0) {
      filterQuery.filter.order.push(`${field} ASC`);
    } else {
      filterQuery.filter.order.push(`${field} DESC`);
    }
  });

  // pagination
  filterQuery.filter.limit = pagination.pageSize || 10;
  filterQuery.filter.offset = pagination.current
    ? (pagination.current - 1) * filterQuery.filter.limit
    : 0;

  const requestItems = await privateRequest(
    `/${resource}?${qs.stringify(filterQuery)}`
  );
  if (!requestItems.success) {
    return requestItems;
  }

  return {
    success: true,
    data: {
      list: requestItems.data,
      pagination: {
        ...pagination,
        total: requestTotal.data.count,
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
