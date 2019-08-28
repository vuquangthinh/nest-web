import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import { Alert, notification, Spin } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import toString from 'lodash/toString';

import imageLogo from '@/assets/square-logo.svg';

import Login from '@/components/Login';
import { createValidationCallback } from '@/utils/utils';
import ChangePassword from './ChangePassword';

import styles from './index.less';
import ChangePasswordSuccess from './ChangePasswordSuccess';
import RequestToken from './RequestToken';

const { PinCode, Submit } = Login;

@connect(({ routing, global, login, loading }) => ({
  login,
  application: global.application,

  resetType: (() => {
    const resetType = routing.location.query.type;
    if (resetType === 'sms') return 'sms';
    return 'email';
  })(),

  resetStep: (() => {
    const { transactionCode, resetToken } = routing.location.query;

    if (transactionCode) {
      return 'step-2';
    }

    if (resetToken) {
      return 'step-3';
    }

    return 'step-1';
  })(),

  pinCode: (() => {
    const token = routing.location.query.resetToken || '';
    if (token) {
      const [, pinCode] = `${token}`.split(' ');
      return toString(pinCode);
    }

    return routing.location.query.code || '';
  })(),
  transactionCode: (() => {
    const token = routing.location.query.resetToken || '';
    const [transactionCode] = `${token}`.split(' ');
    if (transactionCode) {
      return toString(transactionCode);
    }

    return routing.location.query.transactionCode || '';
  })(),
  submitting: loading.effects['reset-password/request'] || loading.effects['reset-password/change'],
}))
class ResetPassword extends Component {
  state = {
    changeSuccess: false,
  };

  resetFormRef = React.createRef();

  lastValues = null;

  handleSubmit = (err, values) => {
    if (err) return;

    this.lastValues = values;

    const { dispatch, resetStep } = this.props;

    if (resetStep === 'step-1') {
      dispatch({
        type: 'reset-password/request',
        payload: {
          ...values,
        },
        // eslint-disable-next-line no-shadow
        onSuccess({ type, transactionCode }) {
          notification.destroy();
          notification.success({
            message: formatMessage({ id: 'module.reset-password.requestSuccess' }),
          });

          setTimeout(() => {
            router.replace({
              pathname: '/auth/reset-password',
              query: {
                transactionCode,
                type,
              },
            });
          }, 1000);
        },

        onFail: () => {
          notification.destroy();
          notification.warning({
            message: formatMessage({ id: 'module.reset-password.requestFail' }),
          });
        },
      });
      return;
    }

    if (resetStep === 'step-2') {
      const { token } = values;
      const { transactionCode } = this.props;
      const resetToken = [transactionCode, token].join(' ');

      dispatch({
        type: 'reset-password/validate',
        payload: {
          ...values,
          token: resetToken,
        },
        onSuccess() {
          notification.destroy();
          router.replace({
            pathname: '/auth/reset-password',
            query: {
              resetToken,
            },
          });
        },
        onValidationFailure: createValidationCallback(this.resetFormRef.current.props.form),
        onFail: error => {
          notification.destroy();

          if (error && error.code === 410) {
            notification.error({
              message: formatMessage({ id: 'module.reset-password.tokenExpired' }),
            });
            this.resetFormRef.current.props.form.setFieldsValue({
              token: ''
            });

            return;
          }

          notification.error({
            message: formatMessage({ id: 'module.reset-password.changeFail' }),
          });
        },
      });
      return;
    }

    if (resetStep === 'step-3') {
      const { transactionCode, pinCode } = this.props;
      const resetToken = [transactionCode, pinCode].join(' ');

      dispatch({
        type: 'reset-password/change',
        payload: {
          ...values,
          token: resetToken,
        },
        onSuccess: () => {
          notification.destroy();
          notification.success({
            message: formatMessage({ id: 'module.reset-password.changeSuccess' }),
          });

          this.setState({
            changeSuccess: true,
          });

          // dispatch({ type: 'login/autoLogin', payload: { data } });

          // show okie
        },
        onValidationFailure: createValidationCallback(this.resetFormRef.current.props.form),
        onFail: () => {
          notification.destroy();
          // notification.success({
          //   message: formatMessage({ id: 'module.reset-password.changeFail' }),
          // });
        },
      });
    }
  };

  handleResendLink = e => {
    e.preventDefault();

    if (!this.lastValues) return;

    const { dispatch } = this.props;

    dispatch({
      type: 'reset-password/request',
      payload: {
        ...this.lastValues,
      },
      // eslint-disable-next-line no-shadow
      onSuccess({ type, transactionCode }) {
        notification.destroy();
        notification.success({
          message: formatMessage({ id: 'module.reset-password.requestSuccess' }),
        });

        router.replace({
          pathname: '/auth/reset-password',
          query: {
            transactionCode,
            type,
          },
        });
      },

      onFail: () => {
        notification.destroy();
        notification.warning({
          message: formatMessage({ id: 'module.reset-password.requestFail' }),
        });
      },
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  renderChangePassword() {
    const { submitting } = this.props;
    const { changeSuccess } = this.state;

    if (changeSuccess) {
      return <ChangePasswordSuccess />;
    }

    return <ChangePassword resetForm={this.resetFormRef} submitting={submitting} />;
  }

  renderEnterCode() {
    const { submitting, resetType, pinCode } = this.props;

    return (
      <Fragment>
        <div className={styles.resetTitle}>
          {resetType === 'email' && formatMessage({ id: 'module.reset-password.resetCode.email' })}
          {resetType === 'sms' && formatMessage({ id: 'module.reset-password.resetCode.sms' })}
        </div>
        <div className={styles.resetDesc}>
          {resetType === 'email' &&
            formatMessage({ id: 'module.reset-password.resetCode.emailDesc' })}
          {resetType === 'sms' && formatMessage({ id: 'module.reset-password.resetCode.smsDesc' })}
        </div>
        <PinCode
          name="token"
          defaultValue={pinCode}
          placeholder={formatMessage({ id: 'module.reset-password.token.placeholder' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'module.reset-password.token.required' }),
            },
          ]}
        />

        <Submit loading={submitting}>
          <FormattedMessage id="module.reset-password.submit.pincode" />
        </Submit>

        <div className={styles.other}>
          <Link className={styles.forgot} to="/auth/login">
            {formatMessage({ id: 'module.reset-password.goback' })}
          </Link>
        </div>

        {this.lastValues && (
          <div className={styles.resend}>
            {resetType === 'email' && formatMessage({ id: 'module.reset-password.resend.email' })}
            {resetType === 'sms' && formatMessage({ id: 'module.reset-password.resend.sms' })}
            &nbsp;
            <a className={styles.resendLink} onClick={this.handleResendLink}>
              {formatMessage({ id: 'module.reset-password.resend.getANewOne' })}
            </a>
          </div>
        )}
      </Fragment>
    );
  }

  render() {
    const { resetStep, application, submitting } = this.props;

    return (
      <DocumentTitle title={formatMessage({ id: 'module.reset-password.pageTitle' })}>
        <div className={styles.main}>
          <Login onSubmit={this.handleSubmit} wrappedComponentRef={this.resetFormRef}>
            <div className={styles.mainHeader}>
              <div className={styles.logoContainer}>
                <img src={imageLogo} width={74} height={68} alt="logo" />
              </div>
              <div className={styles.mainHeaderDescription}>{application.description}</div>
            </div>

            {resetStep === 'step-1' && <RequestToken submitting={submitting} />}
            {resetStep === 'step-2' && this.renderEnterCode()}
            {resetStep === 'step-3' && this.renderChangePassword()}
          </Login>
        </div>
      </DocumentTitle>
    );
  }
}

export default ResetPassword;
