import { useCallback, useMemo, useState } from "react";
import router from "umi/router";
import { clearSortParams } from "@/utils/utils";


export const useTabLocation = (location) => {
  const currentTabSelection = useMemo(() => {
    if (location.query['filters.status']) {
      return location.query['filters.status'];
    }

    return '';
  }, [location]);

  const handleTabChange = useCallback(() => {
    router.push({
      pathname: location.pathname,
      query: {
        ...location.query,
        'pagination.current': '1',
        'filters.status': status,
      },
    });
  }, [location]);

  return [currentTabSelection, handleTabChange];
}


export const useQueryTableChange = (location) => useCallback((pagination = { current: 1 }, filtersArg = {}, sorter = {}) => {
  const newQuery = clearSortParams({
    ...location.query,
  });

  Object.keys(filtersArg).forEach(field => {
    const key = `filters.${field}`;
    newQuery[key] = filtersArg[field];
  });

  Object.keys(pagination).forEach(field => {
    const key = `pagination.${field}`;

    if (['pageSize', 'current'].includes(field)) {
      newQuery[key] = pagination[field];
    }
  });

  if (sorter.field) {
    const key = `sorts.${sorter.field}`;
    newQuery[key] = sorter.order.toLowerCase() === 'ascend' ? 1 : -1;
  }

  router.push({
    pathname: location.pathname,
    query: newQuery,
  });
});

export const useQuery = (currentTab, handleQueryTableChange) => {
  const [query, setQuery] = useState('');

  const handleQuery = useCallback((e) => {
    const search = e.target ? e.target.value : e;

    if (!search) {
      return;
    }

    const filters = {
      q: toString(search).trim(),
    };

    if (currentTab) {
      filters.status = currentTab;
    }

    handleQueryTableChange(
      { current: 1 }, filters
    );
  }, [currentTab, handleQueryTableChange]);

  return [query, handleQuery];
}