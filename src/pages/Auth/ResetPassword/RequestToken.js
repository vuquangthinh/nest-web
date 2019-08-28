import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Login from '@/components/Login';

import styles from './index.less';

const { UserName, Submit } = Login;

export default function RequestToken({ submitting }) {
  return (
    <Fragment>
      <div className={styles.login}>{formatMessage({ id: 'module.reset-password.title' })}</div>
      <UserName
        name="identity"
        placeholder={formatMessage({ id: 'module.reset-password.identity.placeholder' })}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'module.reset-password.identity.required' }),
          },
        ]}
      />

      <Submit loading={submitting}>
        {formatMessage({ id: 'module.reset-password.submit.title' })}
      </Submit>

      <div className={styles.other}>
        <Link className={styles.forgot} to="/auth/login">
          {formatMessage({ id: 'module.reset-password.goback' })}
        </Link>
      </div>
    </Fragment>
  );
}
