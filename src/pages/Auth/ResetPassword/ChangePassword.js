import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';

import Login from '@/components/Login';
import styles from './index.less';

const { Password, Submit } = Login;

export default function ChangePassword({ submitting, resetForm }) {
  return (
    <Fragment>
      <div className={styles.login}>{formatMessage({ id: 'module.reset-password.title' })}</div>

      <Password
        name="password"
        placeholder={formatMessage({ id: 'module.reset-password.password.placeholder' })}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'module.reset-password.password.required' }),
          },
          {
            type: 'string',
            pattern: /^.{6,}$/,
            message: formatMessage({ id: 'module.reset-password.password.tooShort' }),
          },
        ]}
      />
      <Password
        name="passwordConfirm"
        placeholder={formatMessage({
          id: 'module.reset-password.passwordConfirm.placeholder',
        })}
        rules={[
          {
            required: true,
            message: formatMessage({
              id: 'module.reset-password.passwordConfirm.required',
            }),
          },
          {
            validator: async (rule, value) => {
              if (!value) return false;

              if (value === resetForm.current.props.form.getFieldValue('password')) {
                return false;
              }

              throw new Error(
                formatMessage({
                  id: 'module.reset-password.passwordConfirm.notMatch',
                })
              );
            },
          },
        ]}
      />

      <Submit loading={submitting}>
        <FormattedMessage id="module.reset-password.update.title" />
      </Submit>

      <div className={styles.other}>
        <Link className={styles.forgot} to="/auth/login">
          {formatMessage({ id: 'module.reset-password.goback' })}
        </Link>
      </div>
    </Fragment>
  );
}
