import React from 'react';
import { Row, Form, Col, Input, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';
import RoleSelection from './RoleSelection';
import TypeSelection from './TypeSelection';
import StatusSelection from './StatusSelection';
import FilterForm from '@/components/FilterForm';
import DateRangePicker from '@/components/DateRangePicker';

@connect(({ routing }) => ({
  location: routing.location,
}))
@Form.create()
export default class FilterFormImpl extends React.Component {
  // get initial form location url

  get defaultValues() {
    const { location } = this.props;

    const values = {};
    Object.keys(location.query).forEach(field => {
      if (field.startsWith('filters.')) {
        values[field.substr('filters.'.length)] = location.query[field];
      }
    });

    return values;
  }

  handleSubmit = () => {
    const { form, location } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      // create url from params;

      const filter = Object.keys(values).reduce((r, v) => {
        const key = `filters.${v}`;
        return {
          ...r,
          [key]: values[v],
        };
      }, {});

      const newQuery = {
        ...location.query,
        ...filter,
        'filters.q': '',
        'pagination.current': 1,
      };

      router.push({
        pathname: location.pathname,
        query: newQuery,
      });
    });
  };

  render() {
    const { visible, form } = this.props;
    const { defaultValues } = this;

    return (
      <FilterForm visible={visible} handleSubmit={this.handleSubmit}>
        <Row gutter={8}>
          <Col lg={5} md={8}>
            <Form.Item
              label={formatMessage({
                id: 'module.user.filter.name.label',
              })}
            >
              {form.getFieldDecorator('name', {
                initialValue: defaultValues.name,
              })(
                <Input
                  placeholder={formatMessage({
                    id: 'module.user.filter.name.placeholder',
                  })}
                />
              )}
            </Form.Item>
          </Col>
          <Col lg={3} md={8}>
            <Form.Item
              label={formatMessage({
                id: 'module.user.filter.email.label',
              })}
            >
              {form.getFieldDecorator('email', {
                initialValue: defaultValues.email,
              })(
                <Input
                  placeholder={formatMessage({
                    id: 'module.user.filter.email.placeholder',
                  })}
                />
              )}
            </Form.Item>
          </Col>
          <Col lg={3} md={8}>
            <Form.Item
              label={formatMessage({
                id: 'module.user.filter.phone.label',
              })}
            >
              {form.getFieldDecorator('phone', {
                initialValue: defaultValues.phone,
              })(
                <Input
                  placeholder={formatMessage({
                    id: 'module.user.filter.phone.placeholder',
                  })}
                />
              )}
            </Form.Item>
          </Col>
          <Col lg={4} md={6}>
            <Form.Item
              label={formatMessage({
                id: 'module.user.filter.createdOn.label',
              })}
            >
              {form.getFieldDecorator('createdOn')(<DateRangePicker />)}
            </Form.Item>
          </Col>
          <Col lg={2} md={5}>
            <Form.Item
              label={formatMessage({
                id: 'module.user.filter.status.label',
              })}
            >
              {form.getFieldDecorator('status', {
                initialValue: defaultValues.status || '',
              })(<StatusSelection />)}
            </Form.Item>
          </Col>
          <Col lg={2} md={4}>
            <Form.Item
              label={formatMessage({
                id: 'module.user.filter.type.label',
              })}
            >
              {form.getFieldDecorator('type', {
                initialValue: defaultValues.type || '',
              })(<TypeSelection />)}
            </Form.Item>
          </Col>
          <Col lg={2} md={4}>
            <Form.Item
              label={formatMessage({
                id: 'module.user.filter.role.label',
              })}
            >
              {form.getFieldDecorator('roleId', {
                initialValue: defaultValues.roleId || '',
              })(<RoleSelection />)}
            </Form.Item>
          </Col>
          <Col lg={3} md={5}>
            <Form.Item label="&nbsp;">
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                {formatMessage({ id: 'common.filter.button.submit' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </FilterForm>
    );
  }
}
