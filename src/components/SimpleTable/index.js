import React, { PureComponent } from 'react';
import { Table } from 'antd';
import cls from 'classnames';
import SimplePagination from '@/components/SimplePagination';
import styles from './index.less';

export default class SimpleTable extends PureComponent {
  static defaultProps = {
    rowKey: r => r.id,
    Pagination: SimplePagination,
  };

  state = {
    filters: {},
    sorter: {},
  };

  tableRef = React.createRef();

  // eslint-disable-next-line react/sort-comp
  handleTableChange = (pagination, filters, newSorter) => {
    const { onChange } = this.props;

    if (onChange) {
      // eslint-disable-next-line react/destructuring-assignment
      const defaultSorter = this.state.sorter;

      const sorter = {
        ...defaultSorter,
        ...newSorter,
      };

      if (!newSorter.order) {
        sorter.order = sorter.order === 'ascend' ? 'descend' : 'ascend';
      }

      this.setState({
        filters,
        sorter,
      }, () => {
        onChange(pagination, filters, sorter);
      });
    }
  };

  getColumns() {
    const { columns, query } = this.props;
    if (query) {
      let sorted = false;
      return columns.map(column => {
        if (sorted) return column;

        // eslint-disable-next-line eqeqeq
        if (query[`sorts.${column.dataIndex}`]=='1' || query[`sorts.${column.dataIndex}`] == '-1') {
          sorted = true;
          return {
            ...column,
            // eslint-disable-next-line eqeqeq
            sortOrder: query[`sorts.${column.dataIndex}`] == '1' ? 'ascend' : 'descend'
          };
        }

        return column;
      });
    }

    return columns;
  }

  render() {
    const {
      className,
      data: { list, pagination },
      rowKey,
      Pagination,
      resource,
      query,
      ...rest
    } = this.props;

    const { filters, sorter } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={cls([styles.standardTable, className])}>
        <Table
          ref={this.tableRef}
          rowKey={rowKey}
          dataSource={list}
          pagination={false}
          {...rest}
          columns={this.getColumns()}
          onChange={this.handleTableChange}
          scroll={{ x: '100%' }}
        />
        <Pagination
          {...paginationProps}
          resource={resource}
          onChange={current => this.handleTableChange({ ...pagination, current }, filters, sorter)}
        />
      </div>
    );
  }
}
