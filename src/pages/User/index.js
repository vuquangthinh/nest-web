import React, { PureComponent, Fragment } from 'react';
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

import { createValidationCallback, getConstantTitle, clearSortParams } from '@/utils/utils';
import PageContent from '@/components/PageContent';
import FilterHeader from '@/components/FilterHeader';
import Search from '@/components/FilterHeader/Search';
import model from './models';
import CreateAction from './CreateAction';
import UpdateAction from './UpdateAction';
import DeleteAction from './DeleteAction';
import FilterForm from './FilterForm';
import { EMPTY_ARRAY } from '@/constants';
import ChipCode from './ChipCode';
import ChangePasswordAction from './ChangePasswordAction';

/* eslint react/no-multi-comp:0 */
@connect(state => ({
  model: state[model.namespace],
  identity: state.identity,
  loading: state.loading.models[model.namespace],
  location: state.routing.location,

  statuses: state.constant.UserStatus || EMPTY_ARRAY,
  types: state.constant.UserType || EMPTY_ARRAY,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    createModalVisible: false,
    updateModalVisible: false,
    updateRecord: {},
    q: '',
    filterQuery: '',
  };

  get columns() {
    // const { location } = this.props;
    return [
      {
        title: formatMessage({ id: 'module.user.model.username' }),
        sorter: true,
        dataIndex: 'username',
        width: 200,
        render: username => <strong>{username}</strong>,
      },
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
        title: formatMessage({ id: 'module.user.model.company' }),
        dataIndex: 'company.name',
        sorter: true,
        width: 150,
        render: (id, record) => get(record, 'company.name'),
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
          const { types } = this.props;
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
        width: 200,
        align: 'center',
        render: id => (
          <Fragment>
            <ChangePasswordAction id={id} />
            &nbsp;&nbsp;&nbsp;
            <UpdateAction id={id} />
            &nbsp;&nbsp;&nbsp;
            <DeleteAction id={id} />
          </Fragment>
        ),
      },
    ];
  }

  get currentTabSelection() {
    const { location } = this.props;

    if (location.query['filters.status']) {
      return location.query['filters.status'];
    }

    return '';
  }

  handleStandardTableChange = (pagination = { current: 1 }, filtersArg = {}, sorter = {}) => {
    const { location } = this.props;
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
  };

  handleCreateModalVisible = flag => {
    this.setState({
      createModalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateRecord: record || {},
    });
  };

  handleUpdate = (fields, form) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/update',
      payload: {
        ...fields,
      },

      onSuccess: () => {
        form.resetFields();
        this.handleUpdateModalVisible(false);
        this.handleStandardTableChange();
      },

      onValidationFailure: createValidationCallback(form),
    });
  };

  handleTabSelection = status => {
    const { location } = this.props;

    router.push({
      pathname: location.pathname,
      query: {
        ...location.query,
        'pagination.current': '1',
        'filters.status': status,
      },
    });
  };

  onChange = e => {
    if (e.target.value === '') {
      this.handleQuery(e.target.value);
    }
  };

  handleQuery = search =>
    this.handleStandardTableChange(
      { current: 1 },
      {
        q: toString(search).trim(),
        status: this.currentTabSelection,
      }
    );

  toggleExpandFilterForm = () => {
    this.setState(c => ({
      ...c,
      showFilter: !c.showFilter,
    }));
  };

  render() {
    const {
      model: { data },
      loading,
      statuses,
      location,
    } = this.props;

    const { filterQuery, showFilter } = this.state;
    
    return (
      <PageHeaderWrapper title={formatMessage({ id: 'module.user.pageTitle' })}>
        <PageContent>
          <FilterHeader
            current={this.currentTabSelection}
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
            onTabClick={this.handleTabSelection}
          >
            <Search
              placeholder={formatMessage({ id: 'module.user.search.query' })}
              defaultValue={filterQuery}
              onChange={this.onChange}
              onSearch={this.handleQuery}
            />

            <ToggleFilter onClick={this.toggleExpandFilterForm}>
              {formatMessage({ id: 'common.filter.button.title' })}
            </ToggleFilter>
            <CreateAction />
          </FilterHeader>

          <FilterForm visible={showFilter} />

          <StandardTable
            loading={loading}
            data={data}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
            resource={formatMessage({ id: 'module.user.pagination.resource' })}
            query={location.query}
          />
        </PageContent>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
