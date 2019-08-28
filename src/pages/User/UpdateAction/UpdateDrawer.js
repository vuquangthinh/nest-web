import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import {
  Form,
  Button,
  Input,
  Col,
  // DatePicker,
  // Select,
  // Drawer,
  Row,
  // Radio,
  // notification,
  Skeleton,
} from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import router from 'umi/router';
import AeDrawer from '@/components/AeDrawer';
import Header from '@/components/AeDrawer/Header';
import MetaDetail from '@/components/AeDrawer/MetaDetail';
import Actions from '@/components/AeDrawer/Actions';
import Footer from '@/components/AeDrawer/Footer';

import model from '../models';
import { createValidationCallback } from '@/utils/utils';

import { queryOne } from '@/services/user';
import * as language from '@/services/language';
import * as company from '@/services/company';
import * as role from '@/services/role';

import Selection from '@/components/Selection';
import RemoteServiceSelect from '@/components/RemoteServiceSelect';
import PictureInput from '@/components/PictureInput';
import DateInput from '@/components/DateInput';
import PhoneNumberInput from '@/components/PhoneNumberInput';

@connect(state => ({
  listUrl: state[model.namespace].url.list,
}))
@Form.create()
class UpdateDrawerForm extends React.Component {
  static defaultProps = {
    record: {
      created: 'Jean Dupont',
      createdBy: '22349292930',
      createdAt: moment(),
    },
  };

  state = {
    submitLoading: false,
  };

  handleClose = () => {
    const { handleClose, form } = this.props;
    form.resetFields();
    if (handleClose) handleClose();
  };

  handleSubmit = () => {
    const { form, dispatch, id, listUrl } = this.props;

    form.validateFields((err, values) => {

      if (err) {
        if (err.phone && err.phone.expired) {
          // ignore
        } else {
          return;
        }
      }

      this.setState({
        submitLoading: true,
      });

      dispatch({
        type: `${model.namespace}/update`,
        payload: {
          ...values,
          id,
        },
        onValidationFailure: createValidationCallback(form),
        onSuccess: () => {
          this.handleClose();
          this.setState({
            submitLoading: false,
          });
          router.push(listUrl, '/users');
        },
        onFail: () => {
          this.setState({
            submitLoading: false,
          });
        },
      });
    });
  };

  renderHeader() {
    const { loading, record } = this.props;
    if (loading) {
      return <Skeleton active />;
    }
    const { submitLoading } = this.state;

    const { id } = this.props;

    return (
      <Header
        title={formatMessage({ id: 'module.user.update.drawerTitle' })}
        actions={
          <Actions>
            <Button onClick={this.handleClose}>
              {formatMessage({ id: 'common.actions.cancel' })}
            </Button>
            <Button type="primary" loading={submitLoading} onClick={this.handleSubmit}>
              {formatMessage({ id: 'common.actions.save' })}
            </Button>
          </Actions>
        }
      >
        {record.created &&
          record.created.username &&
          record.created.username !== null && (
            <MetaDetail
              items={[
                {
                  label: formatMessage({ id: 'common.fields.createdBy' }),
                  value: formatMessage(
                    { id: 'common.fields.byAt' },
                    {
                      name: `${_.toString(_.get(record, 'created.username'))}`,
                      uid: record.createdBy,
                      time: moment(record.createdAt).format('lll'),
                    }
                  ),
                },
                {
                  label: formatMessage({ id: 'module.user.update.headerID' }),
                  value: id,
                },
              ]}
            />
          )}
      </Header>
    );
  }

  renderFooter() {
    const { loading } = this.props;
    if (loading) {
      return <Skeleton active />;
    }
    const { submitLoading } = this.state;

    return (
      <Footer
        actions={
          <Actions>
            <Button onClick={this.handleClose}>
              {formatMessage({ id: 'common.actions.cancel' })}
            </Button>
            <Button type="primary" loading={submitLoading} onClick={this.handleSubmit}>
              {formatMessage({ id: 'common.actions.save' })}
            </Button>
          </Actions>
        }
      />
    );
  }

  renderContent() {
    const { loading, form, record } = this.props;
    const { getFieldDecorator } = form;

    if (loading) {
      return <Skeleton active />;
    }

    return (
      <Form
        style={{
          width: '100%',
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.update.username' })}
            >
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    transform: val => _.toString(val).trim(),
                    message: formatMessage({ id: 'module.user.validate.required.username' }),
                  },
                  // {
                  //   pattern: /^[^\s](.*)[^\s]$/,
                  //   message: formatMessage({ id: 'module.user.validate.withoutSpace.username' }),
                  // },
                ],
                initialValue: record.username,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.update.status' })}
            >
              {getFieldDecorator('status', {
                initialValue: record.status,
              })(<Selection type="UserStatus" />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.update.firstName' })}
            >
              {getFieldDecorator('firstName', {
                initialValue: record.firstName,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.update.lastName' })}
            >
              {getFieldDecorator('lastName', {
                initialValue: record.lastName,
              })(<Input />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.create.email' })}
            >
              {getFieldDecorator('email', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    type: 'email',
                    message: formatMessage({ id: 'module.user.validate.format.email' }),
                  },
                  {
                    validator: (rule, email) => {
                      const phone = form.getFieldValue('phone') || '';
                      if (email) {
                        if (!phone) {
                          form.resetFields(['phone']);
                        }
                        return [];
                      }

                      if (!phone && (email === '' || email === undefined)) {
                        return [
                          new Error(formatMessage({ id: 'module.user.validate.required.email' })),
                        ];
                      }

                      return [];
                    },
                  },
                ],
                initialValue: record.email,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.create.password' })}
            >
              {getFieldDecorator('password', {
                initialValue: '', // record.password,
              })(<Input.Password />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.update.phone' })}
            >
              {getFieldDecorator('phone', {
                validateTrigger: 'onBlur',
                normalize: value => {
                  if (!value) return '';

                  return value.replace(' ', '');
                },
                rules: [
                  {
                    validator: (rule, phone) => {
                      const email = form.getFieldValue('email') || '';

                      if (phone) {
                        if (!email) {
                          form.resetFields(['email']);
                          form.setFieldsValue({ email: '' });
                        }

                        return [];
                      }

                      if (!email && (phone === '' || phone === undefined)) {
                        return [
                          new Error(formatMessage({ id: 'module.user.validate.required.phone' })),
                        ];
                      }

                      return [];
                    },
                  },
                ],
                initialValue: record.phone,
              })(<PhoneNumberInput />)}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.create.secondaryEmail' })}
            >
              {getFieldDecorator('secondaryEmail', {
                initialValue: record.secondaryEmail,
              })(<Input />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.update.type' })}
            >
              {getFieldDecorator('type', {
                initialValue: record.type,
              })(<Selection type="UserType" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.create.company' })}
            >
              {getFieldDecorator('companyId', {
                initialValue: record.companyId,
              })(
                <RemoteServiceSelect
                  service={company.selectionActive}
                  serviceOne={company.queryOne}
                  dropdownOnEmpty
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.update.role' })}
            >
              {getFieldDecorator('roleId', {
                initialValue: record.roleId,
              })(
                <RemoteServiceSelect
                  placeholder={formatMessage({ id: 'common.selection.default.none' })}
                  service={role.selection}
                  serviceOne={role.queryOne}
                  dropdownOnEmpty
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.update.language' })}
            >
              {getFieldDecorator('languageId', {
                initialValue: record.languageId,
              })(
                <RemoteServiceSelect
                  placeholder={formatMessage({ id: 'common.selection.default.select' })}
                  service={language.selectionActive}
                  serviceOne={language.queryOne}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>

            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.update.dateOfBirth' })}
            >
              {getFieldDecorator('dateOfBirth', {
                initialValue: record.dateOfBirth,
              })(<DateInput />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.update.avatar' })}
            >
              {getFieldDecorator('avatar', {
                initialValue: record.avatar,
              })(<PictureInput />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { visible } = this.props;

    return (
      <AeDrawer
        visible={visible}
        onClose={this.handleClose}
        header={this.renderHeader()}
        footer={this.renderFooter()}
      >
        {this.renderContent()}
      </AeDrawer>
    );
  }
}

export default function UpdateDrawer({ id, visible, handleClose }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
      if (visible) {
        (async () => {
          setLoading(true);
          const response = await queryOne({ id });
          if (response.success) {
            setData(response.data);
            setLoading(false);
          }
        })();
      }
    },
    [id, visible]
  );

  return (
    <UpdateDrawerForm
      id={id}
      loading={loading}
      visible={visible}
      record={data}
      handleClose={handleClose}
    />
  );
}
