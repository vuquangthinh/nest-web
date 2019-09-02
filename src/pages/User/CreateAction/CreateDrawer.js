import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Form, Button, Input, Col, Skeleton, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import moment from 'moment';
import AeDrawer from '@/components/AeDrawer';
import Header from '@/components/AeDrawer/Header';
import MetaDetail from '@/components/AeDrawer/MetaDetail';
import Actions from '@/components/AeDrawer/Actions';
import Footer from '@/components/AeDrawer/Footer';
import model from '../models';
import { createValidationCallback } from '@/utils/utils';
import { getAuthority } from '@/utils/authority';
import * as language from '@/services/language';

import Selection from '@/components/Selection';
import RemoteServiceSelect from '@/components/RemoteServiceSelect';
import DateInput from '@/components/DateInput';
import PictureInput from '@/components/PictureInput';
import PhoneNumberInput from '@/components/PhoneNumberInput';
import { create } from '@/services/user';
// import styles from '@/pages/User/index.less';

const authority = getAuthority();
const isAdmin = authority.includes('admin');

const getRecord = _.memoize(state => ({
  id: '<empty>',
  dateOfBirth: moment('1900-01-01'),
  status: 1,
  roleId: isAdmin ? 1 : 2,
  languageId: 2,
  type: 1,
  companyId: isAdmin ? state.identity.companyId : 1,
  over: 1,
}));

@connect(state => ({
  listUrl: state[model.namespace].url.list,
  record: getRecord(state),
  identity: state.identity,
}))
@Form.create()
class CreateDrawer extends React.Component {
  static defaultProps = {
    loading: false,
    record: {
      created: 'Jean Dupont',
      created_by: '22349292930',
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
    form.validateFields(async (err, values) => {
      if (err) return;

      this.setState({
        submitLoading: true,
      });

      const response = await create(values);

      if (response.success) {
        notification.success({
          message: formatMessage({ id: 'common.notification.createSuccess' }),
        });
      }

      dispatchEventInPayload(response, {
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
    const { loading, record, identity } = this.props;
    const { submitLoading } = this.state;
    if (loading) {
      return <Skeleton active />;
    }

    return (
      <Header
        title={formatMessage({ id: 'module.user.create.drawerTitle' })}
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
              label={formatMessage({ id: 'module.user.create.username' })}
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
              label={formatMessage({ id: 'module.user.create.status' })}
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
              label={formatMessage({ id: 'module.user.create.firstName' })}
            >
              {getFieldDecorator('firstName', {
                initialValue: record.firstName,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.create.lastName' })}
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
                initialValue: record.password,
              })(<Input.Password />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.create.phone' })}
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
              label={formatMessage({ id: 'module.user.create.type' })}
            >
              {getFieldDecorator('type', {
                initialValue: record.type,
              })(<Selection type="UserType" />)}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.create.dateOfBirth' })}
            >
              {getFieldDecorator('dateOfBirth', {
                initialValue: record.dateOfBirth,
              })(<DateInput />)}
            </Form.Item>
            {/* <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.create.over18' })}
            >
              {getFieldDecorator('over', {
                initialValue: record.over,
              })(
                <Radio.Group buttonStyle="solid" size="large" className={styles.radioGroup}>
                  <span className={styles.radioLabel}>Yes&nbsp;&nbsp;&nbsp;&nbsp;</span><Radio value={1} />
                  <span className={styles.radioLabel}>No&nbsp;&nbsp;&nbsp;&nbsp;</span><Radio value={0} />
                </Radio.Group>
              )}
            </Form.Item> */}
          </Col>
          <Col span={12}>
            <Form.Item
              className="input-row"
              label={formatMessage({ id: 'module.user.create.avatar' })}
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

export default CreateDrawer;
