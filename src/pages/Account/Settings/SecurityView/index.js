import React, { Component } from 'react';
import { Form, Input, Icon, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { createValidationCallback } from '@/utils/utils';

const FormItem = Form.Item;
const formItemLayout = {
  // labelCol: {
  //   xs: { span: 24 },
  //   sm: { span: 8 },
  // },
  // wrapperCol: {
  //   xs: { span: 24 },
  //   sm: { span: 16 },
  // },
};

@connect()
@Form.create()
class SecurityView extends Component {
  handleSubmit = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    form.validateFields((err, values) => {
      if (err) return;

      dispatch({
        type: 'accountSetting/updatePassword',
        payload: values,
        onValidationFailure: createValidationCallback(form),
      });
    });
  };

  compareNewPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback(formatMessage({ id: 'common.changePassword.passwordIncorrect' }));
    } else {
      callback();
    }
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={24}>
        <Col span={14}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="Current password">
              {getFieldDecorator('currentPassword', {
                rules: [{ required: true, message: formatMessage({ id: 'common.changePassword.validateOld' }) }],
              })(
                <Input.Password
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="New password">
              {getFieldDecorator('newPassword', {
                rules: [{ required: true, message: formatMessage({ id: 'common.changePassword.validateNew' }) }],
              })(
                <Input.Password
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Confirm new password">
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'common.changePassword.validateConfirm' }),
                  },
                  {
                    validator: this.compareNewPassword,
                  },
                ],
              })(
                <Input.Password
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                />
              )}
            </FormItem>

            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default SecurityView;
