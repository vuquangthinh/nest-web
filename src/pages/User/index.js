import React, { useState, useMemo, useCallback, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import get from 'lodash/get';
import toString from 'lodash/toString';
import { Form } from 'antd';
import moment from 'moment';
import router from 'umi/router';

import StandardTable from '@/components/StandardTable';
import ToggleFilter from '@/components/FilterHeader/ToggleFilter';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { EMPTY_ARRAY } from '@/constants';

import { createValidationCallback, getConstantTitle, clearSortParams, extractFilterQueryString } from '@/utils/utils';
import PageContent from '@/components/PageContent';
import FilterHeader from '@/components/FilterHeader';
import Search from '@/components/FilterHeader/Search';
import model from './models';
import CreateAction from './CreateAction';
import UpdateAction from './UpdateAction';
import DeleteAction from './DeleteAction';
import FilterForm from './FilterForm';
import ChipCode from './ChipCode';
import DetailAction from './DetailAction';
import QueryTable from '@/components/QueryTable';
import { queryAll } from '@/services/user';
import { useTabLocation, useQueryTableChange, useQuery } from '@/components/QueryTable/hooks';

function UserPage({ statuses, location, types }) {
  const [showFilter, setShowFilter] = useState(false);
  const handleShowFilter = useCallback(() => setShowFilter(!showFilter), [showFilter]);

  const columns = useMemo(() => [
    {
      title: formatMessage({ id: 'module.user.model.firstName' }),
      sorter: true,
      dataIndex: 'firstName',
      width: 150,
    },
    {
      title: formatMessage({ id: 'module.user.model.lastName' }),
      sorter: true,
      dataIndex: 'lastName',
      width: 150,
    },
    {
      title: formatMessage({ id: 'module.user.model.email' }),
      dataIndex: 'email',
      sorter: true,
      width: 200,
    },
    {
      title: formatMessage({ id: 'module.user.model.phone' }),
      dataIndex: 'phone',
      sorter: true,
      width: 120,
    },
    {
      title: formatMessage({ id: 'module.user.model.createdAt' }),
      dataIndex: 'createdAt',
      sorter: true,
      width: 130,
      render(text) {
        return moment(text).format('ll');
      },
    },
    {
      title: formatMessage({ id: 'module.user.model.status' }),
      dataIndex: 'status',
      align: 'center',
      width: 75,
      render: val => <ChipCode code={val} />,
    },
    {
      title: formatMessage({ id: 'module.user.model.type' }),
      dataIndex: 'type',
      sorter: true,
      width: 75,
      render: type => {
        return getConstantTitle(types, type);
      },
    },
    {
      title: formatMessage({ id: 'module.user.model.role' }),
      dataIndex: 'role.name',
      sorter: true,
      width: 100,
      render: (id, record) => get(record, 'role.name'),
    },
    {
      title: formatMessage({ id: 'common.columns.actions' }),
      dataIndex: 'id',
      // width: 200,
      align: 'center',
      // fixed: 'right',
      render: id => (
        <Fragment>
          <DetailAction id={id} />
          &nbsp;&nbsp;&nbsp;
          <UpdateAction id={id} />
          &nbsp;&nbsp;&nbsp;
          <DeleteAction id={id} />
        </Fragment>
      ),
    },
  ]);
  const [currentTabSelection, handleTabSelection] = useTabLocation(location);
  const handleQueryChange = useQueryTableChange(location);
  const [filterQuery, handleQuery] = useQuery(currentTabSelection, handleQueryChange);

  return (
    <PageHeaderWrapper title={formatMessage({ id: 'module.user.pageTitle' })}>
      <PageContent>
        <FilterHeader
          current={currentTabSelection}
          tabs={[
            {
              value: '',
              label: formatMessage({ id: 'common.status.all' }),
            },
            ...statuses.map(({ id, title }) => ({
              value: id,
              label: formatMessage({ id: title }),
            })),
          ]}
          onTabClick={handleTabSelection}
        >
          <Search
            placeholder={formatMessage({ id: 'module.user.search.query' })}
            defaultValue={filterQuery}
            onSearch={handleQuery}
          />

          <ToggleFilter onClick={handleShowFilter}>
            {formatMessage({ id: 'common.filter.button.title' })}
          </ToggleFilter>
          <CreateAction />
        </FilterHeader>

        <FilterForm visible={showFilter} />

        <QueryTable
          service={queryAll}
          params={extractFilterQueryString(location.query)}
          onChange={handleQueryChange}
          columns={columns}
        />
      </PageContent>
    </PageHeaderWrapper>
  );
}

export default connect(state => ({
  location: state.routing.location,
  statuses: state.constant.UserStatus || EMPTY_ARRAY,
  types: state.constant.UserType || EMPTY_ARRAY,
}))(UserPage);