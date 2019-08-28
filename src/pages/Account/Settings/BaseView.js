import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button, Row, Col, notification } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import PhoneView from './PhoneView';
import { createValidationCallback } from '@/utils/utils';

const FormItem = Form.Item;

const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

const validatorPhone = (rule, value, callback) => {
  if (/^[0-9]{10,12}$/.test(String(value))) {
    callback();
    return;
  }

  callback(formatMessage({ id: 'app.settings.basic.phone.invalid' }));
};

@connect(({ identity }) => ({
  identity,
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { identity, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = identity[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { identity } = this.props;
    if (identity.avatar) {
      return identity.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handleSubmit = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // format data before submit
      const values = {
        ...fieldsValue,
      };

      dispatch({
        type: 'user/update',
        payload: values,
        onValidationFailure: createValidationCallback(form),
        onSuccess: () => {
          notification.success({
            message: formatMessage({ id: 'app.settings.basic.update-success' }),
          });
        },
      });
    });
  };

  render() {
    const {
      identity,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        {/* <div className={styles.left}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
        <div className={styles.right}> */}
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.username' })}>
              <Input readOnly disabled value={identity.username} />
            </FormItem>

            <Row gutter={12}>
              <Col span={12}>
                <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: false,
                        message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>

            <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              {getFieldDecorator('bio')(
                <Input.TextArea
                  placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: false,
                    message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: false,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="app.settings.basic.update" defaultMessage="Update" />
            </Button>
          </Form>
        {/* </div> */ }
      </div>
    );
  }
}

export default BaseView;
