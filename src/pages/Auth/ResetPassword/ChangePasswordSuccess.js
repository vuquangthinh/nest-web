import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';

import { Button } from 'antd';
import router from 'umi/router';
import styles from './index.less';

const handleGotoLogin = () => router.replace('/auth/login');

export default function ChangePasswordSuccess() {
  return (
    <Fragment>
      <div className={styles.resetTitle}>
        {formatMessage({ id: 'module.reset-password.success' })}
      </div>
      <div className={styles.resetDesc}>
        {formatMessage({ id: 'module.reset-password.successDesc' })}
      </div>

      <Button size="large" style={{ width: '100%' }} type="primary" onClick={handleGotoLogin}>{formatMessage({ id: 'module.reset-password.gotoLogin' })}</Button>
    </Fragment>
  );
}
