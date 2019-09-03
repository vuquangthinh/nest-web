import React, { useState, useMemo, useCallback, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form } from 'antd';
import moment from 'moment';
import router from 'umi/router';

import PageContainer from '@/components/PageContainer';

import {
  createValidationCallback,
  getConstantTitle,
  clearSortParams,
  extractFilterQueryString
} from '@/utils/utils';

import PageContent from '@/components/PageContent';
import Search from '@/components/FilterHeader/Search';
import FilterHeader from '@/components/FilterHeader';
import QueryTable from '@/components/QueryTable';
import { queryAll } from '@/services/country';
import { useQueryTableChange, useQuery } from '@/components/QueryTable/hooks';

function LocationCountry({ location }) {
  const columns = useMemo(() => [
    {
      title: formatMessage({ id: 'module.country.model.code' }),
      sorter: true,
      dataIndex: 'code',
      width: 150,
    },
    {
      title: formatMessage({ id: 'module.country.model.name' }),
      sorter: true,
      dataIndex: 'name',
      // width: 150,
    },
  ]);
  const handleQueryChange = useQueryTableChange(location);
  const [filterQuery, handleQuery] = useQuery(null, handleQueryChange);

  return (
    <PageContainer title={formatMessage({ id: 'module.location.country.pageTitle' })}>
      <PageContent>
        <FilterHeader>
          <Search
            placeholder={formatMessage({ id: 'module.user.search.query' })}
            defaultValue={filterQuery}
            onSearch={handleQuery}
          />
        </FilterHeader>

        <QueryTable
          service={queryAll}
          params={extractFilterQueryString(location.query)}
          onChange={handleQueryChange}
          columns={columns}
        />
      </PageContent>
    </PageContainer>
  );
}

export default LocationCountry;