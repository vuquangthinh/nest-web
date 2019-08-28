import React, { Component } from 'react';
import { Alert, notification } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import { formatMessage, FormattedMessage } from 'umi/locale';
import DocumentTitle from 'react-document-title';
import Login from '@/components/Login';
import styles from './index.less';

const { UserName, Password, Submit } = Login;

@connect(({ global, login, loading }) => ({
  login,
  application: global.application,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    autoLogin: true,
  };

  handleSubmit = (err, values) => {
    const { type, autoLogin } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          rememberMe: autoLogin,
        },
        onSuccess() {
          notification.destroy();
        },
        onValidationFailure: (errors, response) => {
          if (Object.keys(errors).length) {
            // show common message
            notification.warning({
              message: formatMessage({ id: 'module.login.wrongCredentials'})
            });
            return;
          }

          if (response.message) {
            notification.warning({
              message: response.message
            });
          }


          // notification.warning({
          //   message: Object.keys(errors)
          //     .map(e => errors[e])
          //     .join('\n'),
          // });
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting, application } = this.props;
    // const { autoLogin } = this.state;
    return (
      <DocumentTitle title={formatMessage({ id: 'module.login.pageTitle'})}>
        <div className={styles.main}>
          <Login
            onSubmit={this.handleSubmit}
            ref={form => {
            this.loginForm = form;
          }}
          >
            <div className={styles.mainHeader}>
              <h2>{application.name}</h2>
              <div className={styles.mainHeaderDescription}>{application.description}</div>
            </div>

            {/* <div className={styles.login}>{formatMessage({ id: 'module.login.title' })}</div> */}
            <UserName
              name="username"
              placeholder={formatMessage({ id: 'module.login.username.placeholder' })}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            <Password
              name="password"
              placeholder={formatMessage({ id: 'module.login.password.placeholder' })}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            {/* <div>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                <FormattedMessage id="app.login.remember-me" />
              </Checkbox>
            </div> */}
            <Submit loading={submitting}>
              <FormattedMessage id="module.login.submit.title" />
            </Submit>
            <div className={styles.other}>
              <Link className={styles.forgot} to="/auth/reset-password">
                {formatMessage({ id: 'module.login.forgotDetail' })}{' '}
                <span>{formatMessage({ id: 'module.login.forgotHelpLink' })}</span>
              </Link>
            </div>
          </Login>
        </div>
      </DocumentTitle>
    );
  }
}

export default LoginPage;
